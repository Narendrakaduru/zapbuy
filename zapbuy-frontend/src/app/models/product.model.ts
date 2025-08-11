export interface Comment {
  user: string;
  comment: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  discount: number;
  stock: number;
  createdBy: any;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}
