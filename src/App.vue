<template>
  <div id="app" class="container my-0 mx-a">
    <header class="position-absolute">
      <img src="./images/header-logo.svg" alt="">
      <div class="float-right settings d-flex justify-content-center align-items-center">
        <button @click="showSettings = !showSettings">Settings</button>
        <button @click="reset">Reset</button>
        <button @click="showList = !showList">List</button>
      </div>
    </header>
    <div class="canvas-container">
      <canvas id="canvas"></canvas>
    </div>
    <button @click="go" class="go">{{ goText }}</button>
    <b-modal id="settings" title="Settings" v-model="showSettings">
      <b-form-group label="Enter the max number" label-for="input1">
        <b-form-input id="input1" type="number" v-model.trim="number"></b-form-input>
      </b-form-group>
      <div slot="modal-footer" class="w-100">
         <b-btn size="sm" class="float-right" variant="primary" @click="saveSettings">
           Save
         </b-btn>
       </div>
    </b-modal>
    <b-modal id="list" title="List" v-model="showList">
      <ul class="list-unstyled">
        <li v-for="name in list">{{ name }}</li>
      </ul>
    </b-modal>
  </div>
</template>

<script>
import $ from 'jquery'
import store from 'store'
import LuckyDraw from '@/js/luckyDraw'
import '@/js/tagcanvas'

const luckyDraw = new LuckyDraw()
const canvasID = 'canvas'
let tc
let tags = $('<div id="tags">').appendTo($('body')).hide()

export default {
  name: 'App',
  data() {
    return {
      status: 0,
      number: 500,
      list: [],
      showSettings: false,
      showList: false
    }
  },
  computed: {
    goText() {
      switch (this.status) {
        case 0:
          return 'GO'
        case 1:
          return 'STOP'
        case 2:
          return 'GO'
      }
    }
  },
  mounted() {
    this.number = luckyDraw.getAll().length
    this.setOptions()
    $(document).on('keyup', event => {
      if (event.which != 32) {
        return
      }
      event.preventDefault()
      this.processDraw()
    })
    $(window).on('resize', this.resize.bind(this))
    this.resize()
    this.restart()
  },
  methods: {
    go() {
      this.processDraw()
    },
    reset() {
      luckyDraw.reset()
      this.restart()
    },
    saveSettings() {
      let names = [...Array(parseInt(this.number, 10) + 1).keys()].slice(1)
      luckyDraw.update(names)
      this.restart()
      this.showSettings = false
    },
    setOptions() {
      TagCanvas.textColour = null
      TagCanvas.textHeight = 40
      TagCanvas.outlineMethod = 'colour'
      TagCanvas.fadeIn = 800
      TagCanvas.outlineColour = '#fff'
      TagCanvas.outlineOffset = 0
      TagCanvas.depth = 0.97
      TagCanvas.minBrightness = 0.2
      TagCanvas.reverse = true
      TagCanvas.shadowBlur = 2
      TagCanvas.shadowOffset = [1, 1]
      TagCanvas.wheelZoom = false
      TagCanvas.lock = 'xy'
      TagCanvas.weight = true
      TagCanvas.weightMode = 'size'
      TagCanvas.minSpeed = 3
      TagCanvas.maxSpeed = 5
      TagCanvas.initial = [0, 0]
    },
    resize() {
      let canvas = $('#' + canvasID)
      let container = canvas.parent()
      canvas.attr({
        width: container.width(),
        height: container.width()
      })
    },
    restart() {
      this.status = 0
      this.buildTags()
      this.list = luckyDraw.getDrawn().slice()
      TagCanvas.Start(canvasID, 'tags')
      tc = TagCanvas.tc[canvasID]
    },
    buildTags() {
      tags.empty()
      luckyDraw.getRemained().forEach(function(name, i) {
        $('<a href="javascript:">')
          .text(name)
          .css({
            'font-size': '1em'
          })
          .attr('id', 'tag-' + i)
          .appendTo(tags)
      })
      $('<a href="javascript:">')
        .text(' ')
        .css({
          'font-size': '4.5em'
        })
        .attr('id', 'tag-placeholder')
        .appendTo(tags)
    },
    processDraw() {
      if (luckyDraw.getRemained().length == 0) {
        return
      }
      switch (this.status) {
        case 0:
          TagCanvas.Update(canvasID)
          this.status = 1
          tc.yaw = 2.1913498628418893
          tc.pitch = 4.494216926075424
          break
        case 1:
          this.status = 2
          let next = luckyDraw.next()
          let a = tags.find('a').eq(next.index).css({
            'font-size': '4.5em',
            'color': '#ffba00'
          })
          this.list.push(next.name)
          //先停止转动
          tc.yaw = tc.pitch = 0
          tc.UpdateTag(tc.taglist[next.index], a.get(0))
          tc.Weight(tc.taglist)
          window.setTimeout(() => {
            TagCanvas.TagToFront(canvasID, {
              index: next.index,
              time: 300,
              callback: () => {
                a.remove()
                this.status = 0
              }
            })
          }, 0)
          break
      }
    }
  }
}
</script>
