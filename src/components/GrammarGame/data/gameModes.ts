import { GameMode } from '../types';

export const gameModes: GameMode[] = [
  {
    id: 'classify',
    title: 'Đoán Kiểu Câu',
    description: 'Phân loại thì, từ loại'
  },
  {
    id: 'choice',
    title: 'Chọn Đáp Án',
    description: 'Điền từ vào chỗ trống'
  },
  {
    id: 'structure',
    title: 'Cấu Trúc Câu',
    description: 'Xác định thành phần'
  }
];
