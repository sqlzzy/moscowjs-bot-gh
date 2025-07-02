import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

process.env.NTBA_FIX_350 = true;

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {
	polling: process.env.NODE_ENV !== "production",
});

const PORT = process.env.PORT || 9999;
const urlWebApp = "url_your_web_app";

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.post(`/webhook`, (req, res) => {
	bot.processUpdate(req.body);
	res.sendStatus(200);
});

app.post("/send-data", (req, res) => {
	const data = req.body;

	res.json({ status: "OK" });

	bot.sendMessage(data.chat_id, `ID сообщения ${data.id_msg}. Передан через fetch().`);
});

bot.setMyCommands([
	{ command: "/start", description: "Перезапустить бота" },
	{ command: "/presentation", description: "Презентация" },
	{ command: "/web_app", description: "Мини-приложение" },
]);

bot.onText(/\/start$/, (msg) => {
	const chatId = msg.chat.id;

	bot.sendMessage(
		chatId,
		"Привет! Я бот-инструктор по созданию Telegram ботов и мини-приложений. Открой мини-приложение, чтобы ознакомиться с подробной инструкцией.",
		{
			reply_markup: {
				keyboard: [
					[
						{
							text: "Открыть WebApp",
							web_app: {
								url: urlWebApp,
							},
						},
					],
				],
				resize_keyboard: true,
			},
		},
	);
});

bot.onText(/\/start (.+)/, async (msg, match) => {
	try {
		const data = atob(match[1]);

		await bot.sendMessage(msg.chat.id, `Эти данные ${data} отправлены с помощью deeplink-ссылки`);
	} catch (err) {
		console.error("Ошибка декодирования:", err);
	}
});

bot.onText(/\/web_app/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, "Откройте мини-приложение с полной инструкцией и полезными ссылками:", {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "Открыть WebApp",
						web_app: { url: urlWebApp },
					},
				],
			],
			resize_keyboard: true,
		},
	});
});

bot.onText(/\/presentation/, async (msg) => {
	await bot.sendMessage(msg.chat.id, `Скачать презентацию можно по ссылке: https://sqlzzy.dev/presentation.pdf`);
});

bot.on("message", async (msg) => {
	if (msg.web_app_data) {
		try {
			const data = JSON.parse(msg.web_app_data.data);

			if (data.action === "sendDataMsg") {
				await bot.sendMessage(msg.chat.id, `Эти данные action=${data.action} отправлены с помощью sendData`);
			}

			if (data.action === "download_presentation") {
				await bot.sendMessage(msg.chat.id, `Скачать презентацию можно по ссылке: https://sqlzzy.dev/presentation.pdf`);
			}
		} catch (err) {
			console.error("Ошибка:", err);
			bot.sendMessage(msg.chat.id, "❌ Произошла ошибка при обработке запроса");
		}
	}
});

app.listen(PORT, () => {
	console.log(`Бот и сервер запущены на http://localhost:${PORT}`);
});
