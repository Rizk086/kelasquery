<script setup>
import userInfo from '@/services/userInfo';
import { supabase } from '@/utils/supabase';
import { ArrowBigUp } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

const props = defineProps({
  id: {
    type: String,
  },
  v_type: {
    type: String,
  }
})

const chname = `${props?.id}_on_${props?.v_type}`
const vote_data = ref([])
const has_user_voted = ref(false)

async function voteUp() {
  if (!userInfo.isLoggedIn) {
    window.location.href = '/login'
    return
  }

  has_user_voted.value = (vote_data.value.filter((vote => {
    return vote.user_id == userInfo.user_id
  }))).length

  console.log(vote_data.value)
  console.log(has_user_voted.value)

  if (has_user_voted.value) {
    const response = await supabase.from(props?.v_type).delete().eq('ref_id', props?.id)
    console.log('delete',response)
  }
  else {
    const response = await supabase.from(props?.v_type).insert({ ref_id: props?.id })
    console.log('insert',response)
  }
}

onMounted(async () => {
  console.log(props.id, props.v_type)
  vote_data.value = (await supabase.from(props?.v_type).select('id, user_id').eq('ref_id', props?.id)).data

  const channel = supabase.channel(chname)
  channel.on(
    'postgres_changes',
    {event: '*', schema: 'public', table: props?.v_type},
    (payload) => {
      if (payload.eventType == "INSERT") {
        vote_data.value.push(payload.new)
      }
      if (payload.eventType == "DELETE") {
        vote_data.value = vote_data.value.filter(vote => vote.id != payload.old.id)
      }
    })
  .subscribe((status) => {
    console.log("subscription status: ", status, chname)
  })

  has_user_voted.value = vote_data.value.filter((vote => {
    vote.user_id == userInfo.user_id
  })) || false
})

</script>

<template>
  <button @click="voteUp" class="flex flex-row gap-1 w-20 px-4 py-2 rounded shadow bg-white my-4 cursor-pointer">
    <ArrowBigUp />
    <span>{{ vote_data.length }}</span>
  </button>
</template>
