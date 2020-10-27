<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片 -->
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-input placeholder="请输入内容" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary">添加商品</el-button>
          </el-col>
        </el-row>
        <!-- 商品列表信息 -->
        <el-table border style="width: 100%" :data="goodsProductList">
          <el-table-column type="index" label="#" ></el-table-column>
          <el-table-column  label="商品名称" >{{goodsProductList.goods_name}}</el-table-column>
          <el-table-column  label="商品价格(元)"></el-table-column>
          <el-table-column  label="商品重量"></el-table-column>
          <el-table-column  label="创建时间"></el-table-column>
          <el-table-column  label="操作"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>
  <script>
  export default {
      data(){
          return {
            queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
            goodsProductList:[]
          }
      },
      created () {
      this.getGoodsList()
    },
    methods: {
      // 根据分页获取对应的商品列表
      async getGoodsList () {
        const { data: res } = await this.$http.get('goods', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！')
        }
        console.log(res.data)
        this.goodsList = res.data.goods
        //   console.log(this.goodsList)
        this.total = res.data.total
      },   
      }
  };
  </script>
  <style lang="scss" scoped></style>
  