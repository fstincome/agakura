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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          created_at: string
          cta_href: string | null
          cta_label_en: string | null
          cta_label_fr: string | null
          id: string
          image_url: string | null
          published: boolean
          sort_order: number
          subtitle_en: string | null
          subtitle_fr: string | null
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_href?: string | null
          cta_label_en?: string | null
          cta_label_fr?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          subtitle_en?: string | null
          subtitle_fr?: string | null
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_href?: string | null
          cta_label_en?: string | null
          cta_label_fr?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          subtitle_en?: string | null
          subtitle_fr?: string | null
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          body_en: string | null
          body_fr: string | null
          created_at: string
          excerpt_en: string | null
          excerpt_fr: string | null
          id: string
          image_url: string | null
          published: boolean
          published_at: string
          slug: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          body_en?: string | null
          body_fr?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_fr?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug: string
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          body_en?: string | null
          body_fr?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_fr?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_visits: {
        Row: {
          country: string | null
          id: string
          path: string
          referrer: string | null
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          country?: string | null
          id?: string
          path: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          country?: string | null
          id?: string
          path?: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          body_en: string | null
          body_fr: string | null
          category_en: string | null
          category_fr: string | null
          created_at: string
          excerpt_en: string | null
          excerpt_fr: string | null
          id: string
          image_url: string | null
          published: boolean
          slug: string
          sort_order: number
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          body_en?: string | null
          body_fr?: string | null
          category_en?: string | null
          category_fr?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_fr?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug: string
          sort_order?: number
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          body_en?: string | null
          body_fr?: string | null
          category_en?: string | null
          category_fr?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_fr?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string | null
          updated_at: string
          value_en: string | null
          value_fr: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label?: string | null
          updated_at?: string
          value_en?: string | null
          value_fr?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string | null
          updated_at?: string
          value_en?: string | null
          value_fr?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio_en: string | null
          bio_fr: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          name: string
          photo_url: string | null
          position_en: string | null
          position_fr: string | null
          published: boolean
          role_en: string | null
          role_fr: string | null
          sort_order: number
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          bio_en?: string | null
          bio_fr?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          position_en?: string | null
          position_fr?: string | null
          published?: boolean
          role_en?: string | null
          role_fr?: string | null
          sort_order?: number
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          bio_en?: string | null
          bio_fr?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          position_en?: string | null
          position_fr?: string | null
          published?: boolean
          role_en?: string | null
          role_fr?: string | null
          sort_order?: number
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "editor"
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
    Enums: {
      app_role: ["super_admin", "admin", "editor"],
    },
  },
} as const
