import React, { useState } from 'react';
import axios from 'axios';
import { Send, MessageCircle, Smile, X } from 'lucide-react';
import { gsap } from 'gsap';

const ChatBot = () => {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userInput.trim() === '') return;

        setMessages([...messages, { sender: 'user', text: userInput }]);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/chat', { userInput });
            setMessages([...messages, { sender: 'user', text: userInput }, { sender: 'bot', text: response.data.message }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages([...messages, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
        } finally {
            setUserInput('');
            setLoading(false);
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        const chatBox = document.getElementById("chatBox");
        gsap.to(chatBox, { scrollTop: chatBox.scrollHeight, duration: 0.5 });
    };

    return (
        <div>
            {/* Floating Button */}
            <button
                className="z-10 fixed bottom-4 right-4 bg-gradient-to-r from-black to-gray-800 text-white p-4 rounded-full shadow-2xl hover:bg-gradient-to-l hover:from-white hover:to-black border-2 border-white transition-all transform hover:scale-110"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Popup */}
            {isOpen && (
                <div className="fixed bottom-16 right-4 w-[350px] md:w-[400px] bg-black p-6 rounded-2xl shadow-xl border-2 border-gray-700 z-10 transform transition-transform duration-300 ease-in-out">
                    <h1 className="text-2xl font-bold text-center mb-4 text-white">Financial Advisor</h1>

                    <div
                        id="chatBox"
                        className="max-h-64 overflow-y-scroll mb-4 p-2 bg-gray-800 rounded-lg border border-gray-600"
                    >
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                            >
                                <div
                                    className={`p-3 inline-block rounded-lg ${message.sender === 'user' ? 'bg-black text-white shadow-lg' : 'bg-gray-700 text-white shadow-md'}`}
                                >
                                    <strong>{message.sender === 'user' ? 'You' : 'Bot'}:</strong> {message.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="text-center">
                                <Smile className="inline-block animate-pulse text-gray-500" size={24} />
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="flex space-x-2 mt-4">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask about financial terms like 'Stock', 'Bond', 'Dividend'..."
                            className="flex-1 p-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <button
                            type="submit"
                            className="p-3 bg-gradient-to-r from-black to-gray-800 rounded-lg text-white hover:bg-gradient-to-l hover:from-white hover:to-black border-2 border-white"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
