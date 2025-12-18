export const addBaseUrl =
    {
        to(url: string): string {
            return url;
        },
        from(url: string): string | null {
            if (!url) {
                return null
            }
            return process.env.AWS_BASE_URL + url;
        }
    }

export const addUserPhotoUrl =
    {
        to(url: string): string {
            return url;
        },
        from(url: string): string | null {
            if (!url) {
                return null
            }
            return process.env.AWS_BASE_URL + '/users/image/' + url;
        }
    }

export const addBannerCollectionPhotoUrl =
    {
        to(url: string): string {
            return url;
        },
        from(url: string): string | null {
            if (!url) {
                return null
            }
            return process.env.AWS_BASE_URL + '/banner-collection/image/' + url;
        }
    }

export const addBannerImageUrl =
    {
        to(url: string): string {
            return url;
        },
        from(url: string): string | null {
            if (!url) {
                return null
            }
            return process.env.AWS_BASE_URL + "/banner/image/" + url;
        }
    }

export const addProductImageUrl =
    {
        to(url: string): string {
            return url;
        },
        from(url: string): string | null {
            if (!url) {
                return null
            }
            return process.env.AWS_BASE_URL + "/product/image/" + url;
        }
    }

export const addUserImageUrl =
    {
        to(url: string): string {
            return url;
        },
        from(url: string): string | null {
            if (!url) {
                return null
            }
            return process.env.AWS_BASE_URL + "/users/image/" + url;
        }
    }

