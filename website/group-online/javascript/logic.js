var lastMessageId;


var currentAuthorId;
try {
	currentAuthorId = /authorId=([^&]+)/g.exec(window.location.search)[1] || '';
} catch(err) {
	currentAuthorId = '';
}

onload = function() {
	setInterval(pull, 1000);

	id('message-form').onsubmit = function() {
		onSendMessage();
		return false;
	}

	// 设置用户名和头像
	switch(currentAuthorId) {
		case '7dcea149-bf1f-4e7d-b778-df7cb12cc45c':
			setAuthorName('林建入');
			setFaceImage('image/7dcea149-bf1f-4e7d-b778-df7cb12cc45c.jpg');
			break;
		case '24906a68-0702-4f27-aeb1-03713bf0f9be':
			setAuthorName('刘锦权');
			setFaceImage('image/24906a68-0702-4f27-aeb1-03713bf0f9be.jpg');
			break;
	}

	// 启动时间显示
	setInterval(function(){
		var d = new Date();
		var str = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDay() + ' ' + d.getHours() + ':' + d.getMinutes();
		setDateTime(str);
	}, 1000);
}

function id(idStr) {
	return document.getElementById(idStr);
}

function onSendMessage() {
	var mi = id('message-input');
	if (!mi.value) {
		return;
	}
	push(mi.value);
	mi.value = '';
}

function pull() {
	var reqObj = new PullObj();
	reqObj.lastMessageId = lastMessageId;

	request(reqObj, pullCallback)

	function pullCallback(resObj) {
		if (resObj.error) {
			console.log(resObj.error);
			return;
		}

		appendMessageList(resObj.messageList);

		if (resObj.messageList.length > 0) {
			// 滚动到底部
			id('message-form').scrollIntoView();
		}
	}
}

function push(content) {
	var reqObj = new PushObj();
	reqObj.authorId = currentAuthorId;
	reqObj.content = content;

	request(reqObj, undefined);
}

function appendMessageList(messageList) {
	if (!messageList || messageList.length < 1) return;
	// 记录下最新的 messageId
	lastMessageId = messageList[messageList.length-1].messageId;
	// 写入到页面
	messageList.forEach(function(message) {
		var messageDom = messageDomFrom(message);
		append2MessageList(messageDom);
	});

	function append2MessageList(messageDom) {
		if (!messageDom) return;
		var d = id('message-list');
		if (d) {
			d.appendChild(messageDom);
		}
	}
}

function setAuthorName(name) {
	id('author-name').textContent = name;
}

function setFaceImage(url) {
	id('author-face-image').setAttribute('src', url);
}

function setDateTime(str) {
	id('message-date').textContent = str;
}