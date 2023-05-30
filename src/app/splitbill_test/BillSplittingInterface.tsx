import React from 'react';
import { create } from 'zustand';

interface OrderPosition {
  id: number;
  name: string;
  price: number;
  count: number;
}

type UserStoreState = {
  selectedPositions: number[];
  userPrices: Record<number, number>;
  increaseCount: (id: number) => void;
  decreaseCount: (id: number) => void;
};

const useUserStore = create<UserStoreState>((set) => ({
  selectedPositions: [],
  userPrices: {},
  increaseCount: (id) => {
    set((state) => {
      const position = testPositions.find((pos) => pos.id === id);
      if (position) {
        const userPrice = (state.userPrices[id] || 0) + (position.price * position.count);
        return {
          userPrices: {
            ...state.userPrices,
            [id]: userPrice,
          },
          selectedPositions: [...state.selectedPositions, id],
        };
      }
      return state;
    });
  },
  decreaseCount: (id) => {
    set((state) => {
      const position = testPositions.find((pos) => pos.id === id);
      if (position) {
        const userPrice = (state.userPrices[id] || 0) - (position.price * position.count);
        if (userPrice >= 0) {
          return {
            userPrices: {
              ...state.userPrices,
              [id]: userPrice,
            },
            selectedPositions: state.selectedPositions.filter((posId) => posId !== id),
          };
        }
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
  const userPrices = useUserStore((state) => state.userPrices);
  const selectedPositions = useUserStore((state) => state.selectedPositions);
  const increaseCount = useUserStore((state) => state.increaseCount);
  const decreaseCount = useUserStore((state) => state.decreaseCount);

  const handlePay = () => {
    // Payment logic
  };

  const handlePositionClick = (positionId: number) => {
    if (selectedPositions.includes(positionId)) {
      decreaseCount(positionId);
    } else {
      increaseCount(positionId);
    }
  };

  const getTotalPrice = (): number => {
    let totalPrice = 0;
    for (const position of testPositions) {
      totalPrice += position.price * position.count;
    }
    return totalPrice;
  };

  const getRemainingPrice = (): number => {
    let userPrice = 0;
    for (const position of testPositions) {
      if (selectedPositions.includes(position.id)) {
        userPrice += userPrices[position.id] || 0;
      }
    }
    return userPrice;
  };

  const getRemainingPercentage = (): number => {
    const totalPrice = getTotalPrice();
    const remainingPrice = getRemainingPrice();
    return totalPrice > 0 ? (remainingPrice / totalPrice) * 100 : 0;
  };

  if (!testPositions || testPositions.length === 0) {
    return <div>No positions available</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-2xl mb-6">Splitbill test preview</h2>
      {testPositions.map((position) => (
        <div
          key={position.id}
          className={`bg-white rounded shadow-md p-4 mb-4 ${
            userPrices[position.id] && userPrices[position.id] > 0 ? 'bg-blue-100' : ''
          } ${selectedPositions.includes(position.id) ? 'bg-blue-200' : ''}`}
          onClick={() => handlePositionClick(position.id)}
        >
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">{position.name}</h2>
              <span className="text-gray-600">
                ${position.price.toFixed(2) + ' ✖ ' + position.count}
              </span>
            </div>
            <div className="flex items-center">
              <h2 className="px-2 py-1 w-16 text-center text-lg">
                {position.count * position.price + ' $'}
              </h2>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <span className="text-gray-600">Total Price:</span>
        <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Remaining Price:</span>
        <span className="font-bold">${getRemainingPrice().toFixed(2)}</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded mt-4">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${getRemainingPercentage()}%` }}
        ></div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handlePay}>
          Pay ${getRemainingPrice().toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default BillInterface;
