export const WebApp = {
	initData: "",
	initDataUnsafe: {},
	version: "6.7",
	platform: "web",
	sendData: function (data) {
		console.log("[Telegram.WebApp] Данные отправлены боту:", data);
	},
	close: function () {
		console.log("[Telegram.WebApp] Приложение закрыто");
	},
	expand: function () {
		console.log("[Telegram.WebApp] Приложение растянуто на весь экран");
	},
	showPopup: function (options) {
		console.log("[Telegram.WebApp] Попап:", options);
	},
	// Дополнительные методы (по желанию)
	enableClosingConfirmation: function () {
		console.log("[Telegram.WebApp] Подтверждение закрытия включено");
	},
	isExpanded: true,
	themeParams: {
		bg_color: "#f5f7fa",
		text_color: "#000000",
	},
};
