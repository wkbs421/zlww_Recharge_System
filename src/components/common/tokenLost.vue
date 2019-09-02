<template>
    <div>

    </div>
</template>

<script>
import utils from '../../utils/assist'
    export default {
        name:'tokenlost',
        methods: {
            afreshToken(){
                utils.delCookie(token)
                this.$router.push('/index')
            }
        }
    }
</script>

<style scoped>

</style>