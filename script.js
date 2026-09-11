// ОБЩАЯ ФУНКЦИЯ GREEN API

async function callGreenAPI(methodName, httpMethod, body = null) {

    const idInstance = document
        .getElementById('idInstance')
        .value
        .trim();

    const apiTokenInstance = document
        .getElementById('apiTokenInstance')
        .value
        .trim();

    if (!idInstance || !apiTokenInstance) {
        alert('Заполни idInstance и ApiTokenInstance');
        return null;
    }

    const apiUrl =
        `https://api.green-api.com/waInstance${idInstance}/${methodName}/${apiTokenInstance}`;

    try {

        const options = {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(apiUrl, options);

        if (!response.ok) {
            throw new Error(
                `HTTP ошибка! статус: ${response.status}`
            );
        }

        const data = await response.json();

        return data;

    } catch (error) {

        return {
            error: error.message || 'Неизвестная ошибка'
        };
    }
}


// ВЫВОД ОТВЕТА

function showResponse(response) {

    const output = document.getElementById('response');

    if (!response) {
        output.value = '';
        return;
    }

    if (response.error) {
        output.value = `❌ Ошибка:\n${response.error}`;
        return;
    }

    output.value = JSON.stringify(response, null, 2);
}


// GET SETTINGS

async function callGetSettings() {

    const response = await callGreenAPI(
        'getSettings',
        'GET'
    );

    showResponse(response);
}


// GET STATE INSTANCE

async function callGetStateInstance() {

    const response = await callGreenAPI(
        'getStateInstance',
        'GET'
    );

    showResponse(response);
}

// SEND MESSAGE

async function callSendMessage() {

    const phone = document
        .getElementById('chatId-sendMessage')
        .value
        .trim();

    const message = document
        .getElementById('message')
        .value
        .trim();

    if (!phone || !message) {
        alert('Заполни номер телефона и сообщение');
        return;
    }

    const chatId = `${phone}@c.us`;

    const body = {
        chatId: chatId,
        message: message
    };

    const response = await callGreenAPI(
        'sendMessage',
        'POST',
        body
    );

    showResponse(response);
}


// SEND FILE BY URL

async function callSendFileByUrl() {

    const phone = document
        .getElementById('chatId-sendFile')
        .value
        .trim();

    const urlFile = document
        .getElementById('urlFile')
        .value
        .trim();

    if (!phone || !urlFile) {
        alert('Заполни номер телефона и URL файла');
        return;
    }

    if (
        !urlFile.startsWith('http://') &&
        !urlFile.startsWith('https://')
    ) {
        alert('URL должен начинаться с http:// или https://');
        return;
    }

    const chatId = `${phone}@c.us`;

    // Имя файла
    let fileName = 'file.jpg';

    try {

        const url = new URL(urlFile);

        const pathFileName = url.pathname
            .split('/')
            .pop();

        if (pathFileName && pathFileName.includes('.')) {
            fileName = pathFileName;
        }

    } catch (error) {
        alert('Некорректный URL файла');
        return;
    }

    const body = {
        chatId: chatId,
        urlFile: urlFile,
        fileName: fileName
    };

    const response = await callGreenAPI(
        'sendFileByUrl',
        'POST',
        body
    );

    showResponse(response);
}