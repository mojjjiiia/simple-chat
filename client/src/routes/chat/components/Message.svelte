<script lang="ts">
	import type { IMessage } from "../interfaces/message";

    export let message: IMessage;
</script>

<div class="message">
    <p class="author-field"><strong>Author: </strong>{message.sender}</p>
    <p><strong>Message: </strong>{message.message}</p>
</div>

<style>
    .message {
        margin-top: 5px;
        border: thick double #32a1ce;
    }

    .author-field {
        border-bottom: 1px solid hsl(0, 0%, 0%);
    }
</style>