/** @format */

import { ChatBotCanvas } from "@/components/ChatBotCanvas";
import { IsPlayingProvider } from "./context/isPlayingContext";
import { TextToSpeech } from "@/components/TextToSpeech";

export default function Home() {
	return (
		<main className="h-screen">
			<IsPlayingProvider>
				<TextToSpeech />
				<ChatBotCanvas />
			</IsPlayingProvider>
		</main>
	);
}
