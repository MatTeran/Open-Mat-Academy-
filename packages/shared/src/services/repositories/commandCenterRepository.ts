import type { CommandCenterData } from '../../types';

export interface CommandCenterRepository {
  getCommandCenter(): Promise<CommandCenterData>;
}

const emptyCommandCenterData: CommandCenterData = {
  pulse: [],
  attention: [],
  momentum: [],
  liveFeed: [],
  upcoming: [],
  quickCommands: [],
  aiInsights: [],
  snapshots: [],
  pulseInsights: [],
};

export function createMemoryCommandCenterRepository(
  seed: CommandCenterData = emptyCommandCenterData,
): CommandCenterRepository {
  const commandCenter = seed;

  return {
    async getCommandCenter() {
      return {
        pulse: commandCenter.pulse.map((metric) => ({ ...metric })),
        attention: commandCenter.attention.map((item) => ({ ...item })),
        momentum: commandCenter.momentum.map((card) => ({ ...card })),
        liveFeed: commandCenter.liveFeed.map((item) => ({ ...item })),
        upcoming: commandCenter.upcoming.map((event) => ({ ...event })),
        quickCommands: commandCenter.quickCommands.map((command) => ({
          ...command,
        })),
        aiInsights: commandCenter.aiInsights.map((insight) => ({
          ...insight,
        })),
        snapshots: commandCenter.snapshots.map((snapshot) => ({
          ...snapshot,
          points: [...snapshot.points],
        })),
        pulseInsights: commandCenter.pulseInsights.map((insight) => ({
          ...insight,
          charts: {
            '7d': {
              ...insight.charts['7d'],
              line: insight.charts['7d'].line.map((point) => ({ ...point })),
              bars: insight.charts['7d'].bars.map((point) => ({ ...point })),
            },
            '30d': {
              ...insight.charts['30d'],
              line: insight.charts['30d'].line.map((point) => ({ ...point })),
              bars: insight.charts['30d'].bars.map((point) => ({ ...point })),
            },
            '90d': {
              ...insight.charts['90d'],
              line: insight.charts['90d'].line.map((point) => ({ ...point })),
              bars: insight.charts['90d'].bars.map((point) => ({ ...point })),
            },
          },
          rows: insight.rows.map((row) => ({ ...row })),
          takeaways: [...insight.takeaways],
        })),
      };
    },
  };
}

export function createCommandCenterRepository(
  seed?: CommandCenterData,
): CommandCenterRepository {
  return createMemoryCommandCenterRepository(seed);
}
