<template>
  <div>
    <doughnut-chart
        ref="faultchart"
        v-if="loaded"
        :data="faultData"
        :height="100">
    </doughnut-chart>
    <a-table
        ref="table"
        class="usertable"
        :columns="columns"
        :data-source="data"
        rowKey="email"
        size="small"
        :rowClassName="rowClassName"
        :customRow="clickRow"
        bordered
    >
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: "이름",
    dataIndex: "name",
    ellipsis: true
  },
  {
    title: "이메일",
    dataIndex: "email",
    ellipsis: true
  },
  {
    title: "권한",
    dataIndex: "role",
    ellipsis: true
  },
]
import DoughnutChart from "@/components/chart/DoughnutChart";
import api from "@/api/api";
export default {
  name: "adminDashboard",
  components: {
    DoughnutChart
  },
  data () {
    return {
      columns,
      data: [],
      selectedRowIndex: null,
      faultData: {
        labels: ["관리자", "사용자", "Master"],
        datasets: [
          {
            borderWidth: 2,
            backgroundColor: ["#FF5500", "#F8B16D", "#2CB5F2"],
            data: []
          }
        ]
      },
      faultChartLegend: null,
      loaded: false
    }
  },
  async mounted() {
    this.loaded = false
    await api.users.userList()
    .then(async res => {
      if (res.status===200) {
        this.data = res.data
        let u = 0
        let a = 0
        for (let i = 0;i<res.data.length;i++) {
          if (res.data[i].role ==="ROLE_ADMIN") {
            a+=1
          } else {
            u+=1
          }
        }
        this.faultData.datasets[0].data = [a,u,1]
        this.loaded = true
      }
    })

  },
  methods: {
    rowClassName(record,index) {
      return index === this.selectedRowIndex ? "click-active-row" : ""
    },
    clickRow(record,index) {
      return {
        on: {
          click: () => {
            this.selectedRowIndex = index
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>