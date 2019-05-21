<template>
  <input
    class="button is-large is-centered"
    type="button"
    :value="text"
    @click="onClick"
  />
</template>

<script lang="ts">
import '../../styles/components/button.scss';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Prop() private text!: string;
  @Prop() private link!: string;

  private onClick(): void {
    if (this.link) { this.$router.push(this.link); }
  }
}
</script>
