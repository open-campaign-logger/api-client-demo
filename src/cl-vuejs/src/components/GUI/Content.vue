<template>
  <div class="container-fluid">
      <div class="card ">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
                <router-link to="/" class="nav-link" tag="a" active-class="active" exact>LogList</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/user" class="nav-link" tag="a" active-class="active">User</router-link>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <router-view/>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Content',
  data () {
    return {

    }
  }
}
</script>
