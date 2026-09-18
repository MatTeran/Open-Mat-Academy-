import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  cancelClassReminder,
  scheduleClassReminder,
} from '../notifications';
import type { ScheduleClass } from '../../types/schedule';
import {
  getScheduleClassById,
  getThisWeekAnchor,
  getWeekDates,
} from '../../utils/schedule';
import type { Weekday } from '../../types/schedule';

export interface ReservedClassEntry {
  classId: string;
  title: string;
  reservedAt: string;
}

interface ReservationContextValue {
  reservedIds: string[];
  reservingId: string | null;
  isReserved: (classId: string) => boolean;
  reserveClass: (item: ScheduleClass, startsAt: Date) => Promise<void>;
  cancelReservation: (classId: string) => Promise<void>;
  upcomingReserved: Array<{
    item: ScheduleClass;
    startsAt: Date;
  }>;
}

const ReservationContext = createContext<ReservationContextValue | null>(null);

function classStartsAt(
  item: ScheduleClass,
  weekDates: Record<Weekday, Date>,
): Date {
  const dayDate = new Date(weekDates[item.day]);
  const [hours, minutes] = item.startTime.split(':').map(Number);
  dayDate.setHours(hours, minutes, 0, 0);
  return dayDate;
}

export function ReservationProvider({ children }: PropsWithChildren) {
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [reservingId, setReservingId] = useState<string | null>(null);

  const weekDates = useMemo(
    () => getWeekDates(getThisWeekAnchor()),
    [],
  );

  const isReserved = useCallback(
    (classId: string) => reservedIds.includes(classId),
    [reservedIds],
  );

  const reserveClass = useCallback(
    async (item: ScheduleClass, startsAt: Date) => {
      if (reservedIds.includes(item.id)) {
        return;
      }
      setReservingId(item.id);
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 420);
      });
      setReservedIds((current) =>
        current.includes(item.id) ? current : [...current, item.id],
      );
      setReservingId(null);
      void scheduleClassReminder({
        classId: item.id,
        classTitle: item.title,
        startsAt,
      });
    },
    [reservedIds],
  );

  const cancelReservation = useCallback(async (classId: string) => {
    setReservedIds((current) => current.filter((id) => id !== classId));
    await cancelClassReminder(classId);
  }, []);

  const upcomingReserved = useMemo(() => {
    const now = Date.now();
    return reservedIds
      .map((id) => {
        const item = getScheduleClassById(id);
        if (!item) {
          return null;
        }
        const startsAt = classStartsAt(item, weekDates);
        return { item, startsAt };
      })
      .filter((entry): entry is { item: ScheduleClass; startsAt: Date } => {
        return Boolean(entry) && entry!.startsAt.getTime() >= now - 60_000;
      })
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  }, [reservedIds, weekDates]);

  const value = useMemo(
    () => ({
      reservedIds,
      reservingId,
      isReserved,
      reserveClass,
      cancelReservation,
      upcomingReserved,
    }),
    [
      reservedIds,
      reservingId,
      isReserved,
      reserveClass,
      cancelReservation,
      upcomingReserved,
    ],
  );

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations(): ReservationContextValue {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within ReservationProvider');
  }
  return context;
}
