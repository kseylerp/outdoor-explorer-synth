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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
