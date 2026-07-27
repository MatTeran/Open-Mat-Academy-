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
      };
    },
  };
}

export function createCommandCenterRepository(
  seed?: CommandCenterData,
): CommandCenterRepository {
  return createMemoryCommandCenterRepository(seed);
}
