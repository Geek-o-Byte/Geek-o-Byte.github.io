import React from 'react';
import { useStore } from './store';

interface OrderPosition {
  name: string;
  price: number;
  count: number;
  limit: number;
}

const PositionCard: React.FC<{ position: OrderPosition }> = ({ position }) => {
  const { increaseCount, decreaseCount } = useStore();

  const handleIncrease = () => {
    if (position.count < position.limit) {
      increaseCount(position);
    }
  };

  const handleDecrease = () => {
    decreaseCount(position);
  };

  return (
    <div className="bg-white border border-gray-300 rounded p-4">
      <h3 className="font-semibold mb-2">{position.name}</h3>
      <p className="mb-2">Price: ${position.price.toFixed(2)}</p>
      <div className="flex items-center">
        <button
          className="text-lg px-2 py-1 rounded border border-gray-300"
          onClick={handleDecrease}
          disabled={position.count === 0}
        >
          -
        </button>
        <input
          type="number"
          min={0}
          value={position.count}
          readOnly
          className="border border-gray-300 rounded px-2 py-1 w-16 mx-2 text-center"
        />
        <button
          className="text-lg px-2 py-1 rounded border border-gray-300"
          onClick={handleIncrease}
          disabled={position.count >= position.limit}
        >
          +
        </button>
      </div>
    </div>
  );
};

const BillSplittingInterface: React.FC = () => {
  const orderPositions = useStore((state) => state.orderPositions);
  const totalPrice = useStore((state) => state.totalPrice);
  const progress = useStore((state) => state.progress);

  const handlePay = () => {
    // Handle payment logic here
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Bill Splitting Interface</h2>

      <div className="space-y-4">
        {orderPositions.map((position, index) => (
          <PositionCard key={index} position={position} />
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
          <div className="w-full bg-gray-300 rounded overflow-hidden h-4 mt-2">
            <div className="bg-blue-500 h-full" style={{ width: `${progress}%` }}></div>
          </div>
          <span>{`${progress.toFixed(0)}% Paid`}</span>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handlePay}>
          Pay
        </button>
      </div>
    </div>
  );
};

export default BillSplittingInterface;

