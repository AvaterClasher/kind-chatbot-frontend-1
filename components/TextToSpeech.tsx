/** @format */

"use client";
import { AppContext } from "../app/context/isPlayingContext";
import React, { FormEvent, useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
export const TextToSpeech = () => {
	const [userText, setUserText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { isPlaying, setIsPlaying } = useContext(AppContext);
	const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
	const voices = synth?.getVoices();

	const seletedVoice = voices?.find((voice) => voice.name === "Trinoids");

	const speak = (textToSpeak: string) => {
		const utterance = new SpeechSynthesisUtterance(textToSpeak);
		utterance.rate = 0.2;
		utterance.voice = seletedVoice!;

		synth?.speak(utterance);
		setIsPlaying(true);
		utterance.onend = () => {
			setIsPlaying(false);
		};
	};

	async function handleUserText(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (userText === "") return alert("Please enter text");
		setIsLoading(true);
		try {
			const message = userText;
			const response = await fetch("http://127.0.0.1:8000/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_message: message,
				}),
			});
			const data = await response.json();
			const message_to_say = data.chatbot_response;
			console.log(message_to_say)
			speak(message_to_say)
		} catch (error) {
			let message = "";
			if (error instanceof Error) message = error.message;
			console.log(message);
		} finally {
			setIsLoading(false);
			setUserText("");
		}
	}

	return (
		<div className="relative top-0 z-50 ">
			<form
				onSubmit={handleUserText}
				className="absolute top-[850px] left-[34%] space-x-2 pt-2 ">
				<input
					type="text"
					value={userText}
					className="bg-transparent w-[510px] border border-[#b00c3f]/80 outline-none  rounded-lg placeholder:text-[#b00c3f] p-2 text-[#b00c3f]"
					onChange={(e) => setUserText(e.target.value)}
					placeholder="What do you want to know human...."
				/>
				<button
					disabled={isLoading}
					className="text-[#b00c3f] p-2 border border-[#b00c3f] rounded-lg disabled:text-blue-100 
					disabled:cursor-not-allowed disabled:bg-gray-500 hover:scale-110 hover:bg-[#b00c3f] hover:text-black duration-300 transition-all">
					{isLoading ? "thinking..." : "Ask"}
				</button>
			</form>
			<div className="absolute top-3 right-3 ">
				<Link
					target="_blank"
					href={"https://www.github.com/AvaterClasher"}>
					<Image
						src="/icon-256.png"
						alt="moni"
						height={50}
						width={50}
					/>
				</Link>
				<div className="absolute top-0 bg-black/60" />
			</div>
		</div>
	);
};
