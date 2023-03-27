<script lang="ts">
	import { goto } from "$app/navigation";
	import { setContext } from "svelte";
	import { writable } from "svelte/store";
	import { nickname, socket } from "../stores/store";
    import { io } from 'socket.io-client';

    let _nickname: string = '';
    
    $: nickname.set(_nickname);

    function _validateNickname() {
        if (!_nickname || _nickname == '') {
            return false;
        }
        return true;
    }

    function enterChat() {
        if (!_validateNickname()) {
            alert("You should provide nickname");
        } else {
            let sock = io('localhost:3000', {query: {nickname: _nickname}});
            sock.on("connect", () => {
                socket.set(sock);
                goto('/chat');
            })
        }
    }

</script>

<h1>Welcome to the chat</h1>
<div>
    <span>Your nickname is: </span> <input bind:value={_nickname}/>
</div>
<div>
    <button on:click={enterChat}>Enter chat!</button>
</div>


<style>

</style>