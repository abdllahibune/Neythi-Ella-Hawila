export enum Category {
  HENNA = 'henna',
  BEAUTY = 'beauty',
  HAIR_REMOVAL = 'hair_removal'
}

export enum GalleryCategory {
  BRIDAL = 'bridal',
  TRADITIONAL = 'traditional',
  MODERN = 'modern'
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: Category;
  imageUrl: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  category: GalleryCategory;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
