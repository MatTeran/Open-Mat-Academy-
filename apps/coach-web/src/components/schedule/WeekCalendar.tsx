'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { CoachClass } from '@openmat/shared/types';

import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  HOUR_HEIGHT_PX,
  SCHEDULE_FILTERS,
  addDays,
  classAccent,
  classMatchesFilters,
  eventGeometry,
  formatDayHeader,
  formatHourLabel,
  formatWeekRange,
  startOfWeek,
  toISODate,
  weekDays,
  type ScheduleFilterKey,
} from '@/lib/schedule/week';

type Props = {
  classes: CoachClass[];
  initialWeekStart?: string;
  todayISO: string;
};

function MiniMonth({
  weekStart,
  todayISO,
  onSelectDate,
}: {
  weekStart: string;
  todayISO: string;
  onSelectDate: (iso: string) => void;
}) {
  const anchor = new Date(`${weekStart}T12:00:00`);
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = anchor.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-line bg-elevated p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mute">
        {monthLabel}
      </p>
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] text-mute">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) {
            return <span key={`e-${index}`} className="h-7" />;
          }
          const iso = toISODate(new Date(year, month, day, 12));
          const inWeek = weekDays(weekStart).includes(iso);
          const isToday = iso === todayISO;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              className={`h-7 rounded-md text-xs transition ${
                inWeek
                  ? 'bg-gold/20 text-gold-bright'
                  : 'text-mute hover:bg-surface hover:text-white'
              } ${isToday ? 'ring-1 ring-gold' : ''}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WeekCalendar({ classes, initialWeekStart, todayISO }: Props) {
  const defaultStart = toISODate(startOfWeek(new Date(`${todayISO}T12:00:00`)));
  const [weekStart, setWeekStart] = useState(initialWeekStart ?? defaultStart);
  const [activeFilters, setActiveFilters] = useState<Set<ScheduleFilterKey>>(
    () => new Set(SCHEDULE_FILTERS.map((f) => f.key)),
  );

  const days = useMemo(() => weekDays(weekStart), [weekStart]);
  const hours = useMemo(
    () =>
      Array.from(
        { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
        (_, i) => DAY_START_HOUR + i,
      ),
    [],
  );

  const visible = useMemo(
    () =>
      classes.filter(
        (item) =>
          days.includes(item.date) &&
          classMatchesFilters(item, activeFilters) &&
          item.status !== 'cancelled',
      ),
    [activeFilters, classes, days],
  );

  const allDay = visible.filter(
    (item) => item.isSeminar || item.level === 'seminar',
  );
  const timed = visible.filter((item) => !allDay.includes(item));

  function toggleFilter(key: ScheduleFilterKey) {
    setActiveFilters((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function jumpToDate(iso: string) {
    setWeekStart(toISODate(startOfWeek(new Date(`${iso}T12:00:00`))));
  }

  return (
    <div className="flex min-h-[720px] flex-col gap-4 xl:flex-row">
      {/* Left rail — mini calendar + legends */}
      <aside className="w-full shrink-0 space-y-4 xl:w-64">
        <MiniMonth
          weekStart={weekStart}
          todayISO={todayISO}
          onSelectDate={jumpToDate}
        />
        <div className="rounded-xl border border-line bg-elevated p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute">
            Calendars
          </p>
          <ul className="space-y-2">
            {SCHEDULE_FILTERS.map((filter) => {
              const on = activeFilters.has(filter.key);
              return (
                <li key={filter.key}>
                  <button
                    type="button"
                    onClick={() => toggleFilter(filter.key)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition ${
                      on ? 'text-white' : 'text-mute opacity-50'
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: filter.color }}
                    />
                    <span className="flex-1">{filter.label}</span>
                    <span className="text-[10px] uppercase tracking-wide text-mute">
                      {on ? 'on' : 'off'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main week grid */}
      <section className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-line px-2.5 py-1.5 text-sm text-mute hover:text-white"
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              aria-label="Previous week"
            >
              ‹
            </button>
            <button
              type="button"
              className="rounded-lg border border-line px-2.5 py-1.5 text-sm text-mute hover:text-white"
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              aria-label="Next week"
            >
              ›
            </button>
            <button
              type="button"
              className="rounded-lg border border-gold/40 px-3 py-1.5 text-sm text-gold-bright"
              onClick={() => setWeekStart(defaultStart)}
            >
              Today
            </button>
            <p className="text-sm font-medium text-white">
              {formatWeekRange(weekStart)}
            </p>
          </div>
          <p className="text-xs text-mute">{timed.length} timed classes</p>
        </div>

        {/* Day headers */}
        <div
          className="grid border-b border-line"
          style={{ gridTemplateColumns: '64px repeat(7, minmax(0, 1fr))' }}
        >
          <div className="border-r border-line" />
          {days.map((iso) => {
            const header = formatDayHeader(iso);
            const isToday = iso === todayISO;
            return (
              <div
                key={iso}
                className={`border-r border-line px-2 py-3 text-center last:border-r-0 ${
                  isToday ? 'bg-gold/10' : ''
                }`}
              >
                <p className="text-[11px] uppercase tracking-wide text-mute">
                  {header.weekday}
                </p>
                <p
                  className={`text-sm ${isToday ? 'text-gold-bright' : 'text-white'}`}
                >
                  {header.day}
                </p>
              </div>
            );
          })}
        </div>

        {/* All-day / multi-day strip */}
        <div
          className="grid min-h-10 border-b border-line"
          style={{ gridTemplateColumns: '64px repeat(7, minmax(0, 1fr))' }}
        >
          <div className="flex items-center justify-end border-r border-line px-2 text-[10px] uppercase tracking-wide text-mute">
            All-day
          </div>
          {days.map((iso) => {
            const items = allDay.filter((c) => c.date === iso);
            return (
              <div
                key={`all-${iso}`}
                className="space-y-1 border-r border-line p-1 last:border-r-0"
              >
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/schedule/${item.id}`}
                    className="block truncate rounded-md px-2 py-1 text-[11px] text-white"
                    style={{ backgroundColor: classAccent(item) }}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>

        {/* Timed grid */}
        <div className="max-h-[70vh] overflow-auto">
          <div
            className="grid"
            style={{ gridTemplateColumns: '64px repeat(7, minmax(0, 1fr))' }}
          >
            {/* Time labels */}
            <div className="relative border-r border-line">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="relative border-b border-line/70"
                  style={{ height: HOUR_HEIGHT_PX }}
                >
                  <span className="absolute -top-2 right-2 text-[10px] text-mute">
                    {formatHourLabel(hour)}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((iso) => {
              const dayClasses = timed.filter((item) => item.date === iso);
              // Simple overlap lanes
              const lanes = layoutLanes(dayClasses);
              return (
                <div
                  key={`col-${iso}`}
                  className={`relative border-r border-line last:border-r-0 ${
                    iso === todayISO ? 'bg-gold/[0.03]' : ''
                  }`}
                  style={{
                    height: (DAY_END_HOUR - DAY_START_HOUR + 1) * HOUR_HEIGHT_PX,
                  }}
                >
                  {hours.map((hour) => (
                    <div
                      key={`${iso}-${hour}`}
                      className="border-b border-line/60"
                      style={{ height: HOUR_HEIGHT_PX }}
                    />
                  ))}
                  {dayClasses.map((item) => {
                    const geo = eventGeometry(item.startTime, item.endTime);
                    const lane = lanes.get(item.id) ?? { index: 0, total: 1 };
                    const widthPct = 100 / lane.total;
                    const leftPct = lane.index * widthPct;
                    const color = classAccent(item);
                    return (
                      <Link
                        key={item.id}
                        href={`/schedule/${item.id}`}
                        className="absolute overflow-hidden rounded-md border border-black/20 px-1.5 py-1 text-left shadow-sm transition hover:brightness-110"
                        style={{
                          top: geo.top,
                          height: geo.height,
                          left: `calc(${leftPct}% + 2px)`,
                          width: `calc(${widthPct}% - 4px)`,
                          backgroundColor: color,
                        }}
                        title={`${item.startTime} ${item.title}`}
                      >
                        <p className="text-[10px] font-semibold text-black/80">
                          {item.startTime}
                        </p>
                        <p className="truncate text-[11px] font-medium text-ink">
                          {item.title}
                        </p>
                        <p className="truncate text-[10px] text-black/70">
                          {item.instructorName} · {item.reservedCount}/
                          {item.capacity}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function layoutLanes(items: CoachClass[]) {
  const sorted = [...items].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );
  const laneEnds: number[] = [];
  const result = new Map<string, { index: number; total: number }>();
  const assigned: Array<{ id: string; lane: number; end: number }> = [];

  for (const item of sorted) {
    const start = item.startTime
      .split(':')
      .reduce((acc, v, i) => acc + Number(v) * (i === 0 ? 60 : 1), 0);
    const end = item.endTime
      .split(':')
      .reduce((acc, v, i) => acc + Number(v) * (i === 0 ? 60 : 1), 0);
    let lane = laneEnds.findIndex((endMin) => endMin <= start);
    if (lane < 0) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    assigned.push({ id: item.id, lane, end });
  }

  const maxLane = Math.max(0, ...assigned.map((a) => a.lane)) + 1;
  for (const entry of assigned) {
    result.set(entry.id, { index: entry.lane, total: maxLane });
  }
  return result;
}
