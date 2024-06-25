<template>
  <div class="chemical-label" ref="label">
    <h1>{{ chemical.name }}</h1>
    <p>CAS: {{ chemical.cas }}</p>
    <div v-for="icon in chemical.icons" :key="icon.id">
      <img :src="require('@/assets/' + icon.src)" :alt="icon.desc">
    </div>
    <p>{{ chemical.description }}</p>
    <button @click="exportLabel">Export as PDF</button>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  data() {
    return {
      chemical: {
        name: "Acetone",
        cas: "67-64-1",
        icons: [
          { id: 1, src: "flammable.png", desc: "Flammable" },
          { id: 2, src: "toxic.png", desc: "Toxic" }
        ],
        description: "Highly flammable liquid and vapor. Causes serious eye irritation."
      }
    }
  },
  methods: {
    exportLabel() {
      html2canvas(this.$refs.label).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('chemical-label.pdf');
      });
    }
  }
}
</script>

<style scoped>
.chemical-label img {
  width: 100px; /* Adjust icon size as needed */
}
</style>
