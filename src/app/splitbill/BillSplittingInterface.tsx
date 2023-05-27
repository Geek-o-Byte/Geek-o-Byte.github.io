import React from 'react';
import create from 'zustand';

interface OrderPosition {
  id: number;
  name: string;
  price: number;
  count: number;
}

type UserStoreState = {
  userCounts: Record<number, number>;
  increaseCount: (id: number) => void;
  decreaseCount: (id: number) => void;
};

const useUserStore = create<UserStoreState>((set) => ({
  userCounts: {},
  increaseCount: (id) => {
    set((state) => ({
      userCounts: {
        ...state.userCounts,
        [id]: (state.userCounts[id] ?? 0) + 1,
      },
    }));
  },
  decreaseCount: (id) => {
    set((state) => {
      const count = state.userCounts[id] ?? 0;
      if (count > 0) {
        return {
          userCounts: {
            ...state.userCounts,
            [id]: count - 1,
          },
        };
      }
      return state;
    });
  },
}));

const testPositions: OrderPosition[] = [
  {
    id: 1,
    name: 'Item 1',
    price: 10,
    count: 5,
  },
  {
    id: 2,
    name: 'Item 2',
    price: 20,
    count: 3,
  },
  {
    id: 3,
    name: 'Item 3',
    price: 15,
    count: 4,
  },
];

const BillInterface: React.FC = () => {
  const userCounts = useUserStore((state) => state.userCounts);
  const increaseCount = useUserStore((state) => state.increaseCount);
  const decreaseCount = useUserStore((state) => state.decreaseCount);

  const handlePay = () => {
    // Payment logic
  };

  const getTotalPrice = (): number => {
    let totalPrice = 0;
    for (const position of testPositions) {
      const userCount = userCounts[position.id] ?? 0;
      totalPrice += position.price * userCount;
    }
    return totalPrice;
  };

  if (!testPositions || testPositions.length === 0) {
    return <div>No positions available</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      {testPositions.map((position) => (
        <div
          key={position.id}
          className={`bg-white rounded shadow-md p-4 mb-4 ${
            userCounts[position.id] && userCounts[position.id] > 0 ? 'bg-blue-100' : ''
          }`}
        >
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-gray-600">${position.price.toFixed(2)}</span>
              <h2 className="text-xl font-bold">{position.name}</h2>
            </div>
            <div className="flex items-center">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => increaseCount(position.id)}
                disabled={userCounts[position.id] && userCounts[position.id] >= position.count}
              >
                +
              </button>
              <input
                type="number"
                min="0"
                className="border border-gray-300 px-2 py-1 mx-2 w-16 text-center"
                value={userCounts[position.id] ?? 0}
                onChange={() => {}}
              />
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => decreaseCount(position.id)}
                disabled={!userCounts[position.id] || userCounts[position.id] === 0}
              >
                -
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <span className="text-gray-600">Total Price:</span>
        <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handlePay}>
          Pay
        </button>
      </div>
    </div>
  );
};

export default BillInterface;