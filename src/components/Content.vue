<script>
import { SELECTABLE_DOMS, RESERVED_CLASSNAMES } from '../store/constants';
export default {
  name: 'DcContent',
  components: {},
  methods: {
    initEventListener: function(event) {
      var self = this;

      $(this.selectableDoms())
        .bind('click', function(e) {
          self.clickedOnSelectableDom(e);
        })
        .bind('mouseover', function(e) {
          self.mouseOverSelectableDom(e);
        })
        .bind('mouseout', function(e) {
          self.mouseOutSelectableDom(e);
        });
    },
    clickedOnSelectableDom: function(e) {},

    mouseOverSelectableDom: function(e) {
      e.stopPropagation();
      var dom = e.currentTarget;

      dom.classList.add('data-collector_selectable-dom');
      dom.setAttribute('data_collector_color', this.getSelectableColor());
    },

    mouseOutSelectableDom: function(e) {
      e.stopPropagation();
      e.preventDefault();

      var self = this;
      var dom = e.target;

      self.clearMouseOverDom(dom);
    },

    clearMouseOverDom: function(dom) {
      dom.removeAttribute('data_collector_color');
      dom.classList.remove('data-collector_selectable-dom');
    },

    isReserved: function(dom) {
      const $dom = $(dom);

      return RESERVED_CLASSNAMES.some(
        u_dom => $dom.hasClass(u_dom) || $dom.parents('.' + u_dom).length > 0
      );
    },

    selectableDoms: function() {
      const self = this;
      const selectable_doms_selector = SELECTABLE_DOMS.join(' , ');

      const selector = $(selectable_doms_selector).filter(function(index, dom) {
        if (self.isReserved(dom)) return false;

        return true;
      });

      return selector;
    },

    getSelectableColor: function() {
      var self = this;
      return 'rgb(25, 25, 25, 0.5)';
    },
  },
};
</script>

<template>
  <div class="content">
    asf
    adsds
    asf
    <button v-on:click="initEventListener">Text</button>
  </div>
</template>

<style>
.content {
  color: #000;
  width: 100%;
  overflow-y: scroll;
  position: relative;
  height: 400px;
}
.data-collector_selectable-dom {
  background-color: #ff9933;
  outline: solid 2px #ff9933;
}
</style>
