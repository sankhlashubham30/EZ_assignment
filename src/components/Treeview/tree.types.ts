export interface TreeNode {
  id: string;
  name: string;
  parentId: string | null;
  children: string[]; // store only IDs
  isExpanded: boolean;
  isLoading?: boolean;
  hasLoaded?: boolean;
}