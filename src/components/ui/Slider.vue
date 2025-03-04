<script setup lang="ts">
import { useTemplateRef } from 'vue';

type SliderProps = {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    disabled?: boolean;
    className?: string;
}

const { className = "",
        max = 1,
        min = 0,
        step = 0.01,
        value = 0,
        disabled = false } = defineProps<SliderProps>()

const emit = defineEmits<{
    input: [value: number]
    change: [value: number]
}>()

</script>
<template>
<div :class="className">
    <input
        type="range"
        ref="range"
        :max="max"
        :min="min"
        :step="step"
        :value="value"
        :disabled="disabled"
        @input="(event) => emit('input',parseFloat((event.target as HTMLInputElement).value))"
        @change="(event) => emit('change',parseFloat((event.target as HTMLInputElement).value))"
    />
</div>
</template>
<style lang="css" scoped>

input[type="range"] {
    appearance: none;
    height: 7px;
    border-radius: 0 60%;
    transform: rotate(-.5deg);
    width: 100%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    background-color: #FAFAFA;
    height: 17px;
    width: 10px;
    border-radius: 100% 0;
    transform: rotate(-17deg);
    box-shadow: inset -1px -1px 0 rgba(0,0,0,0.3)
}

input[type="range"]::-ms-thumb {
    appearance: none;
    background-color: #FAFAFA;
    height: 17px;
    width: 10px;
    border-radius: 100% 0;
    transform: rotate(-17deg);
    box-shadow: inset -1px -1px 0 rgba(0,0,0,0.3)

}

</style>