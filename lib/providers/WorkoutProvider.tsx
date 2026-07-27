import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { INITIAL_WORKOUTS } from '../mocks/workouts';
import type { Workout, WorkoutDraft } from '../../types/workout';

interface WorkoutContextValue {
  workouts: Workout[];
  getWorkout: (id: string) => Workout | undefined;
  saveWorkout: (draft: WorkoutDraft, id?: string) => Workout;
  deleteWorkout: (id: string) => void;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: PropsWithChildren) {
  const [workouts, setWorkouts] = useState<Workout[]>(INITIAL_WORKOUTS);

  const getWorkout = useCallback(
    (id: string) => workouts.find((item) => item.id === id),
    [workouts],
  );

  const saveWorkout = useCallback((draft: WorkoutDraft, id?: string) => {
    if (id) {
      const updated: Workout = { ...draft, id };
      setWorkouts((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
      return updated;
    }

    const created: Workout = {
      ...draft,
      id: `w-${Date.now()}`,
    };
    setWorkouts((current) => [created, ...current]);
    return created;
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      workouts,
      getWorkout,
      saveWorkout,
      deleteWorkout,
    }),
    [deleteWorkout, getWorkout, saveWorkout, workouts],
  );

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
}

export function useWorkouts(): WorkoutContextValue {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used within WorkoutProvider.');
  }
  return context;
}
