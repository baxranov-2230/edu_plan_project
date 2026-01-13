import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import subgroupApi from '../api/subgroupApi';

export const useSubgroups = (params) => {
    return useQuery({
        queryKey: ['subgroups', params],
        queryFn: () => subgroupApi.getAll(params),
        keepPreviousData: true,
    });
};

export const useCreateSubgroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subgroupApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['subgroups']);
        },
    });
};
// Add update/delete if needed later
