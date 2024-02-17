import "./globals.css";

export const metadata = {
	title: "Kind-Chatbot",
	description: "Rustfully made by Soumyadip Moni",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-black">{children}</body>
		</html>
	);
}