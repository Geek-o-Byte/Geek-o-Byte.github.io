import create from 'zustand';

interface OrderPosition {
  name: string;
  price: number;
  count: number;
  limit: number;
}

interface StoreState {
  orderPositions: OrderPosition[];
  totalPrice: number;
  progress: number;
  increaseCount: (position: OrderPosition) => void;
  decreaseCount: (position: OrderPosition) => void;
  pay: () => void;
}

const useStore = create<StoreState>((set) => ({
  orderPositions: [
    { name: 'Position 1', price: 10, count: 0, limit: 5 },
    { name: 'Position 2', price: 20, count: 0, limit: 3 },
    { name: 'Position 3', price: 30, count: 0, limit: 2 },
  ],
  totalPrice: 0,
  progress: 0,
  increaseCount: (position) => {
    set((state) => {
      const updatedPositions = state.orderPositions.map((pos) =>
        pos === position ? { ...pos, count: pos.count + 1 } : pos
      );
      const totalPrice = updatedPositions.reduce((sum, pos) => sum + pos.price * pos.count, 0);
      const progress = (totalPrice / (state.totalPrice + position.price)) * 100;
      return {
        orderPositions: updatedPositions,
        totalPrice: state.totalPrice + position.price,
        progress,
      };
    });
  },
  decreaseCount: (position) => {
    set((state) => {
      if (position.count === 0) return state;
      const updatedPositions = state.orderPositions.map((pos) =>
        pos === position ? { ...pos, count: pos.count - 1 } : pos
      );
      const totalPrice = updatedPositions.reduce((sum, pos) => sum + pos.price * pos.count, 0);
      const progress = (totalPrice / state.totalPrice) * 100;
      return {
        orderPositions: updatedPositions,
        totalPrice,
        progress,
      };
    });
  },
  pay: () => {
    // Handle payment logic here
  },
}));

export type { OrderPosition };
export { useStore };
//export { useStore, OrderPosition };
