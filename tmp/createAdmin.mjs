import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dtqxftylvmrfzyblfgzt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cXhmdHlsdm1yZnp5YmxmZ3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjYxMTYsImV4cCI6MjA4ODY0MjExNn0.-Aj9IMMfDDxwlyPZsCJMGU_SkHcdfyAoRuvEL301h8s";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdmin() {
  const email = process.argv[2] || "admin2@therockettrg.com";
  const password = process.argv[3] || "AdminTRG2026!";

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: "Admin Secundário",
      }
    }
  });

  if (error) {
    console.error("Erro ao criar usuário:", error.message);
  } else {
    console.log("Usuário criado com sucesso!");
    console.log("Email:", email);
    console.log("Senha:", password);
  }
}

createAdmin();
