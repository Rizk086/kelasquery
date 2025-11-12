import { supabase } from "@/utils/supabase";
import { ref } from "vue";

const { data, error } = await supabase.from('metadata').select()

if (error)
  throw new Error(error)

const metadata = ref(new Map())

// Insert the data to the Map
data.forEach((e) => {
  metadata.value.set(e.key, e.value)
})

export default metadata
