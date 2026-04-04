const SummaryCard = ({ title, amount }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">₹{amount.toLocaleString('en-IN')}</p>
        </div>
    );
};

export default SummaryCard;
