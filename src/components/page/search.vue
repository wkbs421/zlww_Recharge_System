<template>
  <div id="main_index">
    <div class="logo">
      <img src="@/assets/bgImg.jpeg" alt="" />
      <p>物联网卡充值系统</p>
    </div>
    <form action="javascript:;" @submit="toSearch">
      <div class="search">
        <div class="input-box">
          <input
            type="search"
            v-model="cardNo"
            ref="searchInput"
            placeholder="请输入物联网卡号"
          />
        </div>
        <yd-button bgcolor="#ff5722" color="#fff" @click.native="toSearch"
          >查询</yd-button
        >
      </div>
    </form>
  </div>
</template>

<script>
import api from "@/utils/httpClient.vue";
export default {
  mixins: [api],
  name: "index",
  data() {
    return {
      cardNo: "", //搜索关键字
      pageNumber: 1,
      pageSize: 15
    };
  },
  methods: {
    //   搜索
    async toSearch() {
      if (this.cardNo) {
        this.$dialog.loading.open("搜索中");
        await this.getByPhoneApi();
        this.$dialog.loading.close();
      } else {
        this.$dialog.toast({
          mes: "卡号不能为空",
          timeout: 1500,
          icon: "error"
        });
      }
    },
    // 获取返修信息列表api
    getByPhoneApi() {
      var params = { msisdn: this.cardNo.trim() };
      return this.get(
        "/recharge/sreachCard",
        params,
        data => {
          if (data.code == 1) {
            this.$router.push({
              name: "rechargeCards",
              query: {
                cardNo: this.cardNo
              }
            });
          }
        },
        error => {
          this.$dialog.loading.close();
        }
      );
    }
  }
};
</script>

<style scoped>
#main_index {
  background: #fff;
  height: 100vh;
}
input {
  border: 0;
}
.logo {
  text-align: center;
  padding-top: 1rem;
}
.logo > img {
  width: 2rem;
}
.logo > p {
  margin-top: 0.2rem;
  font-size: 0.38rem;
  /* font-weight: bold; */
}
.search {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
.input-box {
  width: 4.5rem;
  height: 0.7rem;
  border: 1px solid #ff5722;
  border-radius: 0.06rem;
  margin-right: 0.2rem;
  padding-left: 0.2rem;
}
.input-box > input {
  width: 100%;
  height: 100%;
  line-height: 100%;
}
.input-box > input::-webkit-input-placeholder {
  color: #ff5722;
  line-height: 1.4;
  /* font-size: 0.24rem; */
}
div >>> .yd-btn {
  height: 0.7rem;
  padding: 0 0.3rem;
}
.searchResult {
  color: rgb(102, 102, 102);
  text-align: center;
  margin-top: 1.4rem;
  font-size: 0.3rem;
}
</style>