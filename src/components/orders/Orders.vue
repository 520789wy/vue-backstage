<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-input placeholder="请输入内容"  class="input-with-select" style="width:35%">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-table
            :data="goodorderLists"
            stripe
            border
            style="width: 100%">
                <el-table-column type="index" label="#" width="50"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="pay_status" label="是否付款"></el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column prop="create_time" label="下单时间"></el-table-column>
                <el-table-column  label="操作">
                    <template>
                        <el-tooltip class="item" effect="dark" content="修改收货地址" placement="top-start">
                            <el-button type="primary" icon="el-icon-edit"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看物流信息" placement="top-start">
                            <el-button type="info" icon="el-icon-location-outline"></el-button>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                //存放订单列表
                goodorderLists:[],
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:5,
                    pay_status:'',
                    is_send:''
                }
            }
        },
        created () {
            this.getOrderList()
        },
        methods: {
            async getOrderList(){
                const {data: res} = await this.$http.get('orders',{params:this.queryInfo})
                if(res.meta.status !== 200){
                   return this.$message.error("订单列表获取失败")
                }
                this.goodorderLists = res.data.goods
                console.log(this.getOrderList)
            }
        }
        
    }
</script>
<style></style>