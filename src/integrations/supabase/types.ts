export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          activity_id: string
          company_recommendations: string
          created_at: string
          danger_level: string
          description: string
          duration: string
          guide_id: string
          image_urls: string[] | null
          permit_details: string | null
          permit_required: boolean
          price: string
          target_audience: string
          title: string
          updated_at: string
        }
        Insert: {
          activity_id?: string
          company_recommendations: string
          created_at?: string
          danger_level: string
          description: string
          duration: string
          guide_id: string
          image_urls?: string[] | null
          permit_details?: string | null
          permit_required?: boolean
          price: string
          target_audience: string
          title: string
          updated_at?: string
        }
        Update: {
          activity_id?: string
          company_recommendations?: string
          created_at?: string
          danger_level?: string
          description?: string
          duration?: string
          guide_id?: string
          image_urls?: string[] | null
          permit_details?: string | null
          permit_required?: boolean
          price?: string
          target_audience?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      guide_services: {
        Row: {
          bio: string
          certifications: string | null
          created_at: string
          guide_id: string
          guide_name: string
          guide_photo_url: string | null
          languages: string[]
          location: string
          service_id: string
          services: string
          updated_at: string
          years_of_experience: string
        }
        Insert: {
          bio: string
          certifications?: string | null
          created_at?: string
          guide_id: string
          guide_name: string
          guide_photo_url?: string | null
          languages: string[]
          location: string
          service_id?: string
          services: string
          updated_at?: string
          years_of_experience: string
        }
        Update: {
          bio?: string
          certifications?: string | null
          created_at?: string
          guide_id?: string
          guide_name?: string
          guide_photo_url?: string | null
          languages?: string[]
          location?: string
          service_id?: string
          services?: string
          updated_at?: string
          years_of_experience?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          activity_id: string | null
          company_name: string
          created_at: string
          id: string
          website_url: string
        }
        Insert: {
          activity_id?: string | null
          company_name: string
          created_at?: string
          id?: string
          website_url: string
        }
        Update: {
          activity_id?: string | null
          company_name?: string
          created_at?: string
          id?: string
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["activity_id"]
          },
        ]
      }
      saved_trips: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration: string | null
          id: string
          itinerary: Json | null
          journey: Json | null
          location: string | null
          map_center: Json | null
          markers: Json | null
          price_estimate: number | null
          title: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration?: string | null
          id?: string
          itinerary?: Json | null
          journey?: Json | null
          location?: string | null
          map_center?: Json | null
          markers?: Json | null
          price_estimate?: number | null
          title: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration?: string | null
          id?: string
          itinerary?: Json | null
          journey?: Json | null
          location?: string | null
          map_center?: Json | null
          markers?: Json | null
          price_estimate?: number | null
          title?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string | null
          id: string
          key_name: string
          key_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_name: string
          key_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key_name?: string
          key_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_buddies: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trip_preferences: {
        Row: {
          created_at: string
          id: string
          preferences: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preferences: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preferences?: string
          updated_at?: string
          user_id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
