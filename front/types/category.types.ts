export interface Category {
  id: string;
  name: string;
  position: number;
  parentId: string | null;
  createdAt?: string;
  updatedAt?: string;
  parent?: Category | null;
  children?: Category[];

  _count?: {
    children: number;
  };
}

export type ParentCategory = Category;

export interface CreateCategoryDto {
  name: string;
  position: number;
  parentId?: string | null; 
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface ReorderCategoryDto {
  categoryIds: string[];
}

export interface PaginatedCategoriesResponse {
  data: Category[];
  meta: {
    totalCategories: number;
    lastPage: number;
    page: number;
  };
}