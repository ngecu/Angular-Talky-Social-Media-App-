export interface Comment {
    comment_id: string;
    comment_created_by_user_id: string;
    comment_creator_username: string;
    comment_post_id: string;
    comment: string;
    comment_replied_to_id: string | null;
    comment_created_at: string;
    profileImage: string;
  }
  