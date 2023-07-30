import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
// 在 Setup Store 中：
//  ref() 就是 state 属性
//  computed() 就是 getters
//  function() 就是 actions
  const count = ref(0);

  const double = computed(() => {
    return count.value * 2;
  });
  
  function increment() {
    count.value++;
  }

  return { count, double, increment };
});
