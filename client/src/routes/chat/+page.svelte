<script lang="ts">
	import { goto } from "$app/navigation";
	import type { Socket } from "socket.io-client";
	import { afterUpdate, beforeUpdate, element } from "svelte/internal";
	import { nickname, socket } from "../../stores/store";
	import Message from "./components/Message.svelte";
	import type { IMessage } from "./interfaces/message";


    let nickname_: string;
    let newMesage: IMessage;
    let socket_: Socket;

    let messageBoxElement: Element;


    let messages: Array<IMessage> = [];

    beforeUpdate(() => {
        if (!nickname_) goto('/');
    });

	afterUpdate(() => {
		messageBoxElement.scroll({ top: messageBoxElement.scrollHeight});
	});

    nickname.subscribe(value => {
		nickname_ = value;

        newMesage = {
            sender: nickname_,
            message: ''
        }
	});

    socket.subscribe(value => {
        socket_ = value;
        socket_.on("message:all", (data) => {messages = data})
        socket_.emit("message:getAll", (resp: Array<IMessage>) => {messages = resp});
    })

    function sendMessage() {
        socket_.emit('message:new', newMesage);
        newMesage.message = '';
    }

    function disconnect() {
        socket_.disconnect();
    }

</script>


<div class='chat-area'>
    <div class="welcome">
        <h3>
            Welcome {nickname_}
        </h3>
        <a on:click={ disconnect } href="/">Back to login page</a>
    </div>
    <div class="messages-area">
        <div bind:this={messageBoxElement} class="wrapper">
            {#each messages as message_}
                <Message message={message_}/>
            {/each}
        </div>
    </div>
    <div class="input-area">
      <textarea bind:value={newMesage.message} class="input-field"/>
      <button on:click={sendMessage} disabled={!newMesage.message} style="width: 150px">Send!</button>
    </div>
</div>

<style>
    .chat-area {
        display: flex; 
        flex-direction: column;
        width: 500px;
        height: 800px;
    }

    .welcome {
        box-sizing: content-box;
        border: 15px ridge red;
        text-align: center;
        height: 100px;
    }

    .messages-area {
        display: flex;
        flex-direction: column;
        justify-content: end;
        border: 15px ridge red;
        max-height: 600px;
        min-height: 600px;
    }

    .input-area {
        display: flex;
        justify-content: left;
        border: 15px ridge red;
        padding: 10px 10px 10px 10px;
        vertical-align: middle;
    }

    .input-field {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        margin: auto 10px auto 10px;
        height: 50px;
        width: 300px;
    }

    textarea {
        resize: none;
    }

    .wrapper {
        display: block;
        overflow-y: auto;
    }
</style>
