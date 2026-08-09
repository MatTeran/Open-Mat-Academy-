import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { SYSTEM_TECHNIQUES } from '../data/systemTechniques';
import { normalizeTechniqueName } from '../data/techniqueMeta';
import type {
  CreateMemberTechniqueInput,
  MemberTechnique,
  TechniqueId,
  UpdateMemberTechniqueInput,
} from '../../types/technique';
import { useAuth } from './AuthProvider';

const STORAGE_KEY = '@openmat/member_custom_techniques_v1';
const NOTES_KEY = '@openmat/member_technique_notes_v1';

interface TechniqueContextValue {
  ready: boolean;
  techniques: MemberTechnique[];
  activeTechniques: MemberTechnique[];
  getTechnique: (id: TechniqueId) => MemberTechnique | undefined;
  getLabel: (id: TechniqueId) => string;
  getCategory: (id: TechniqueId) => MemberTechnique['category'];
  getPersonalNotes: (id: TechniqueId) => string;
  findByName: (
    name: string,
    options?: { includeArchived?: boolean },
  ) => MemberTechnique | undefined;
  createTechnique: (input: CreateMemberTechniqueInput) => MemberTechnique;
  updateTechnique: (
    id: TechniqueId,
    patch: UpdateMemberTechniqueInput,
  ) => MemberTechnique | null;
  archiveTechnique: (id: TechniqueId) => boolean;
  restoreTechnique: (id: TechniqueId) => boolean;
  setPersonalNotes: (id: TechniqueId, notes: string) => void;
}

const TechniqueContext = createContext<TechniqueContextValue | null>(null);

function createId(): string {
  return `custom-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function TechniqueProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [customTechniques, setCustomTechniques] = useState<MemberTechnique[]>(
    [],
  );
  const [personalNotes, setPersonalNotesState] = useState<
    Record<string, string>
  >({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const [rawTechniques, rawNotes] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(NOTES_KEY),
        ]);
        if (!mounted) {
          return;
        }
        if (rawTechniques) {
          const parsed = JSON.parse(rawTechniques) as MemberTechnique[];
          if (Array.isArray(parsed)) {
            setCustomTechniques(
              parsed.filter((item) => !item.id.startsWith('notes-')),
            );
          }
        }
        if (rawNotes) {
          const parsedNotes = JSON.parse(rawNotes) as Record<string, string>;
          if (parsedNotes && typeof parsedNotes === 'object') {
            setPersonalNotesState(parsedNotes);
          }
        }
      } catch {
        // Keep empty catalog if storage is unavailable.
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persistTechniques = useCallback(async (next: MemberTechnique[]) => {
    setCustomTechniques(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Local-only failure should not block UI.
    }
  }, []);

  const persistNotes = useCallback(async (next: Record<string, string>) => {
    setPersonalNotesState(next);
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const techniques = useMemo(
    () => [...SYSTEM_TECHNIQUES, ...customTechniques],
    [customTechniques],
  );

  const activeTechniques = useMemo(
    () => techniques.filter((item) => !item.archived),
    [techniques],
  );

  const byId = useMemo(() => {
    const map = new Map<string, MemberTechnique>();
    for (const technique of techniques) {
      map.set(technique.id, technique);
    }
    return map;
  }, [techniques]);

  const getTechnique = useCallback(
    (id: TechniqueId) => byId.get(id),
    [byId],
  );

  const getLabel = useCallback(
    (id: TechniqueId) => byId.get(id)?.name ?? id,
    [byId],
  );

  const getCategory = useCallback(
    (id: TechniqueId) => byId.get(id)?.category ?? 'other',
    [byId],
  );

  const getPersonalNotes = useCallback(
    (id: TechniqueId) => {
      if (personalNotes[id]) {
        return personalNotes[id];
      }
      return byId.get(id)?.notes ?? '';
    },
    [byId, personalNotes],
  );

  const findByName = useCallback(
    (name: string, options?: { includeArchived?: boolean }) => {
      const normalized = normalizeTechniqueName(name);
      if (!normalized) {
        return undefined;
      }
      return techniques.find((item) => {
        if (!options?.includeArchived && item.archived) {
          return false;
        }
        return normalizeTechniqueName(item.name) === normalized;
      });
    },
    [techniques],
  );

  const createTechnique = useCallback(
    (input: CreateMemberTechniqueInput) => {
      const name = input.name.trim().replace(/\s+/g, ' ');
      const existing = findByName(name);
      if (existing) {
        return existing;
      }

      const now = new Date().toISOString();
      const created: MemberTechnique = {
        id: createId(),
        name,
        category: input.category,
        subcategory: input.subcategory?.trim() || null,
        position: input.position?.trim() || null,
        format: input.format ?? 'both',
        sourceType: 'user',
        createdByUserId: user?.id ?? 'local-member',
        academyId: null,
        isPublic: false,
        archived: false,
        notes: input.notes?.trim() ?? '',
        createdAt: now,
        updatedAt: now,
      };
      void persistTechniques([created, ...customTechniques]);
      if (created.notes) {
        void persistNotes({ ...personalNotes, [created.id]: created.notes });
      }
      return created;
    },
    [
      customTechniques,
      findByName,
      persistNotes,
      persistTechniques,
      personalNotes,
      user?.id,
    ],
  );

  const updateTechnique = useCallback(
    (id: TechniqueId, patch: UpdateMemberTechniqueInput) => {
      const current = customTechniques.find((item) => item.id === id);
      if (!current || current.sourceType !== 'user') {
        return null;
      }
      const updated: MemberTechnique = {
        ...current,
        ...patch,
        name: patch.name != null ? patch.name.trim() : current.name,
        subcategory:
          patch.subcategory !== undefined
            ? patch.subcategory?.trim() || null
            : current.subcategory,
        position:
          patch.position !== undefined
            ? patch.position?.trim() || null
            : current.position,
        notes:
          patch.notes !== undefined ? patch.notes.trim() : current.notes,
        id: current.id,
        sourceType: 'user',
        createdByUserId: current.createdByUserId,
        academyId: current.academyId,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
      };
      void persistTechniques(
        customTechniques.map((item) => (item.id === id ? updated : item)),
      );
      if (patch.notes !== undefined) {
        void persistNotes({ ...personalNotes, [id]: updated.notes });
      }
      return updated;
    },
    [customTechniques, persistNotes, persistTechniques, personalNotes],
  );

  const archiveTechnique = useCallback(
    (id: TechniqueId) => {
      const current = customTechniques.find((item) => item.id === id);
      if (!current || current.sourceType !== 'user') {
        return false;
      }
      void persistTechniques(
        customTechniques.map((item) =>
          item.id === id
            ? {
                ...item,
                archived: true,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      return true;
    },
    [customTechniques, persistTechniques],
  );

  const restoreTechnique = useCallback(
    (id: TechniqueId) => {
      const current = customTechniques.find((item) => item.id === id);
      if (!current || current.sourceType !== 'user') {
        return false;
      }
      void persistTechniques(
        customTechniques.map((item) =>
          item.id === id
            ? {
                ...item,
                archived: false,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      return true;
    },
    [customTechniques, persistTechniques],
  );

  const setPersonalNotes = useCallback(
    (id: TechniqueId, notes: string) => {
      const next = { ...personalNotes, [id]: notes.trim() };
      void persistNotes(next);
      const custom = customTechniques.find((item) => item.id === id);
      if (custom) {
        void persistTechniques(
          customTechniques.map((item) =>
            item.id === id
              ? {
                  ...item,
                  notes: notes.trim(),
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        );
      }
    },
    [customTechniques, persistNotes, persistTechniques, personalNotes],
  );

  const value = useMemo<TechniqueContextValue>(
    () => ({
      ready,
      techniques,
      activeTechniques,
      getTechnique,
      getLabel,
      getCategory,
      getPersonalNotes,
      findByName,
      createTechnique,
      updateTechnique,
      archiveTechnique,
      restoreTechnique,
      setPersonalNotes,
    }),
    [
      activeTechniques,
      archiveTechnique,
      createTechnique,
      findByName,
      getCategory,
      getLabel,
      getPersonalNotes,
      getTechnique,
      ready,
      restoreTechnique,
      setPersonalNotes,
      techniques,
      updateTechnique,
    ],
  );

  return (
    <TechniqueContext.Provider value={value}>
      {children}
    </TechniqueContext.Provider>
  );
}

export function useTechniques(): TechniqueContextValue {
  const context = useContext(TechniqueContext);
  if (!context) {
    throw new Error('useTechniques must be used within TechniqueProvider.');
  }
  return context;
}
