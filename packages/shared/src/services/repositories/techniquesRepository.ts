import type {
  CreateTechniqueInput,
  Technique,
  UpdateTechniqueInput,
} from '../../types';

export interface TechniqueListQuery {
  academyId?: string;
  difficulty?: Technique['difficulty'];
  position?: Technique['position'];
  favoriteOnly?: boolean;
  tag?: string;
  search?: string;
}

export interface TechniquesRepository {
  list(query?: TechniqueListQuery): Promise<Technique[]>;
  getById(id: string): Promise<Technique | null>;
  create(
    input: CreateTechniqueInput,
    author: { id: string; name: string; academyId: string },
  ): Promise<Technique>;
  update(id: string, input: UpdateTechniqueInput): Promise<Technique | null>;
  toggleFavorite(id: string): Promise<Technique | null>;
}

export function createMemoryTechniquesRepository(
  seed: Technique[] = [],
): TechniquesRepository {
  let techniques = [...seed];

  return {
    async list(query) {
      let result = [...techniques];
      if (query?.academyId) {
        result = result.filter((item) => item.academyId === query.academyId);
      }
      if (query?.difficulty) {
        result = result.filter((item) => item.difficulty === query.difficulty);
      }
      if (query?.position) {
        result = result.filter((item) => item.position === query.position);
      }
      if (query?.favoriteOnly) {
        result = result.filter((item) => item.isFavorite);
      }
      if (query?.tag) {
        const tag = query.tag.trim().toLowerCase();
        result = result.filter((item) =>
          item.tags.some((itemTag) => itemTag.toLowerCase() === tag),
        );
      }
      if (query?.search?.trim()) {
        const needle = query.search.trim().toLowerCase();
        result = result.filter(
          (item) =>
            item.title.toLowerCase().includes(needle) ||
            item.description.toLowerCase().includes(needle) ||
            item.tags.some((tag) => tag.toLowerCase().includes(needle)),
        );
      }
      return result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async getById(id) {
      return techniques.find((item) => item.id === id) ?? null;
    },
    async create(input, author) {
      const now = new Date().toISOString();
      const created: Technique = {
        id: `tech-${Date.now()}`,
        title: input.title.trim(),
        description: input.description.trim(),
        difficulty: input.difficulty,
        position: input.position,
        tags: [...input.tags],
        commonMistakes: [...input.commonMistakes],
        videoUri: input.videoUri ?? null,
        imageUris: input.imageUris ?? [],
        isFavorite: input.isFavorite ?? false,
        authorId: author.id,
        authorName: author.name,
        academyId: author.academyId,
        createdAt: now,
        updatedAt: now,
      };
      techniques = [created, ...techniques];
      return created;
    },
    async update(id, input) {
      const index = techniques.findIndex((item) => item.id === id);
      if (index < 0) {
        return null;
      }
      const current = techniques[index];
      const updated: Technique = {
        ...current,
        ...input,
        title: input.title?.trim() ?? current.title,
        description: input.description?.trim() ?? current.description,
        tags: input.tags ? [...input.tags] : current.tags,
        commonMistakes: input.commonMistakes
          ? [...input.commonMistakes]
          : current.commonMistakes,
        imageUris: input.imageUris ? [...input.imageUris] : current.imageUris,
        videoUri:
          input.videoUri !== undefined ? input.videoUri : current.videoUri,
        updatedAt: new Date().toISOString(),
      };
      techniques = [
        ...techniques.slice(0, index),
        updated,
        ...techniques.slice(index + 1),
      ];
      return updated;
    },
    async toggleFavorite(id) {
      const current = techniques.find((item) => item.id === id);
      if (!current) {
        return null;
      }
      return this.update(id, { isFavorite: !current.isFavorite });
    },
  };
}

export function createTechniquesRepository(
  seed?: Technique[],
): TechniquesRepository {
  return createMemoryTechniquesRepository(seed);
}
