export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          autor: string
          conteudo: string
          created_at: string
          data_publicacao: string
          id: string
          imagem_capa: string | null
          publicado: boolean | null
          slug: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          autor: string
          conteudo: string
          created_at?: string
          data_publicacao?: string
          id?: string
          imagem_capa?: string | null
          publicado?: boolean | null
          slug?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          autor?: string
          conteudo?: string
          created_at?: string
          data_publicacao?: string
          id?: string
          imagem_capa?: string | null
          publicado?: boolean | null
          slug?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      caminhoes: {
        Row: {
          ano: string | null
          created_at: string
          descricao: string | null
          driver_id: string | null
          id: string
          imagem_url: string | null
          marca: string | null
          modelo: string | null
          nome: string
          placa: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ano?: string | null
          created_at?: string
          descricao?: string | null
          driver_id?: string | null
          id?: string
          imagem_url?: string | null
          marca?: string | null
          modelo?: string | null
          nome: string
          placa?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ano?: string | null
          created_at?: string
          descricao?: string | null
          driver_id?: string | null
          id?: string
          imagem_url?: string | null
          marca?: string | null
          modelo?: string | null
          nome?: string
          placa?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "caminhoes_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      comboios: {
        Row: {
          created_at: string
          data: string
          descricao: string | null
          id: string
          imagem_url: string | null
          mapa: string | null
          participantes: string[] | null
          rota: string
          status: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          mapa?: string | null
          participantes?: string[] | null
          rota: string
          status?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          mapa?: string | null
          participantes?: string[] | null
          rota?: string
          status?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          avatar_url: string | null
          avatar_url_caminhao: string | null
          bio: string | null
          cargo: string | null
          created_at: string
          data_entrada: string
          id: string
          km_rodados: number
          nickname: string
          nome: string
          pontos: number
          status: string
          updated_at: string
          viagens: number
          vtlog_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          avatar_url_caminhao?: string | null
          bio?: string | null
          cargo?: string | null
          created_at?: string
          data_entrada?: string
          id?: string
          km_rodados?: number
          nickname: string
          nome: string
          pontos?: number
          status?: string
          updated_at?: string
          viagens?: number
          vtlog_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          avatar_url_caminhao?: string | null
          bio?: string | null
          cargo?: string | null
          created_at?: string
          data_entrada?: string
          id?: string
          km_rodados?: number
          nickname?: string
          nome?: string
          pontos?: number
          status?: string
          updated_at?: string
          viagens?: number
          vtlog_id?: string | null
        }
        Relationships: []
      }
      galeria: {
        Row: {
          categoria: string | null
          created_at: string
          data: string
          descricao: string | null
          id: string
          imagem_url: string
          titulo: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          imagem_url: string
          titulo: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          imagem_url?: string
          titulo?: string
        }
        Relationships: []
      }
      hall_da_fama: {
        Row: {
          created_at: string
          descricao: string | null
          driver_id: string
          id: string
          mes_referencia: string | null
          tipo: string | null
          titulo: string
          trofeu: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          driver_id: string
          id?: string
          mes_referencia?: string | null
          tipo?: string | null
          titulo: string
          trofeu?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          driver_id?: string
          id?: string
          mes_referencia?: string | null
          tipo?: string | null
          titulo?: string
          trofeu?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hall_da_fama_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      lives: {
        Row: {
          ativa: boolean
          created_at: string
          id: string
          plataforma: string
          streamer: string
          titulo: string
          url: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          id?: string
          plataforma?: string
          streamer: string
          titulo: string
          url: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          id?: string
          plataforma?: string
          streamer?: string
          titulo?: string
          url?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          created_at: string
          descricao: string | null
          estoque: number
          id: string
          imagem_url: string | null
          nome: string
          preco: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          estoque?: number
          id?: string
          imagem_url?: string | null
          nome: string
          preco: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          estoque?: number
          id?: string
          imagem_url?: string | null
          nome?: string
          preco?: number
          updated_at?: string
        }
        Relationships: []
      }
      ranking: {
        Row: {
          created_at: string
          driver_id: string
          id: string
          km: number
          periodo: string | null
          pontos: number
          posicao: number
          updated_at: string
          viagens: number
        }
        Insert: {
          created_at?: string
          driver_id: string
          id?: string
          km?: number
          periodo?: string | null
          pontos?: number
          posicao?: number
          updated_at?: string
          viagens?: number
        }
        Update: {
          created_at?: string
          driver_id?: string
          id?: string
          km?: number
          periodo?: string | null
          pontos?: number
          posicao?: number
          updated_at?: string
          viagens?: number
        }
        Relationships: [
          {
            foreignKeyName: "ranking_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      recrutamento: {
        Row: {
          created_at: string
          discord: string | null
          experiencia: string | null
          id: string
          idade: number | null
          motivacao: string | null
          nickname: string
          nome: string
          status: string
          steam: string | null
          updated_at: string
          vtlog_id: string | null
        }
        Insert: {
          created_at?: string
          discord?: string | null
          experiencia?: string | null
          id?: string
          idade?: number | null
          motivacao?: string | null
          nickname: string
          nome: string
          status?: string
          steam?: string | null
          updated_at?: string
          vtlog_id?: string | null
        }
        Update: {
          created_at?: string
          discord?: string | null
          experiencia?: string | null
          id?: string
          idade?: number | null
          motivacao?: string | null
          nickname?: string
          nome?: string
          status?: string
          steam?: string | null
          updated_at?: string
          vtlog_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
