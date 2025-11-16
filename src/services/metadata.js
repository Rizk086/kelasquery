import { supabase } from "@/utils/supabase";
import { ref } from "vue";

const metadata = ref(new Map())
try {
  const { data, error } = await supabase.from('metadata').select()
  if (error)
    throw error

  // Insert the data to the Map
  data.forEach((e) => {
    metadata.value.set(e.key, e.value)
  })
  
} catch (error) {
  console.error(error)
  metadata.value.set("error", error)
}

export default metadata
