import Vue from 'vue';
import Home from './Home';

describe('Home', () => {
  it('should have the proper message', () => {
    const Constructor = Vue.extend(Home);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.home h1').textContent).toEqual('Hello World');
  });
});
