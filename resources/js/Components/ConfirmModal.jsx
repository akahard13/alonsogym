// ConfirmModal.js
const ConfirmModal = ({ show, onClose, onConfirm, title }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-1/4 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={onConfirm}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            Eliminar
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
