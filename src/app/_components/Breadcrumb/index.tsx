/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { useMemo } from 'react'
import { api } from '~/trpc/react'

interface BreadcrumbProps {
  userID?: string
  recipeID?: string
}

export default function Breadcrumb(props: BreadcrumbProps) {
  // Trpc: get user name by id
  const { data: userName } = api.user.getNameById.useQuery(
    {
      id: props.userID || '',
    },
    {
      enabled: !!props.userID,
    },
  )

  // Trpc: get recipe name by id
  const { data: recipeName } = api.recipe.getNameById.useQuery(
    {
      recipeId: props.recipeID || '',
    },
    {
      enabled:
        !!props.recipeID &&
        props.recipeID !== 'all' &&
        props.recipeID !== 'new',
    },
  )

  // Memo: hightlight the current page
  const hightlightIndex = useMemo(() => {
    if (
      props.userID &&
      props.recipeID &&
      props.recipeID !== 'all' &&
      props.recipeID !== 'new'
    ) {
      return 2
    }
    if (props.userID && props.recipeID === 'all') {
      return 1
    }
    return 0
  }, [props.userID, props.recipeID])

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        href="/"
        sx={{
          color:
            hightlightIndex === 0
              ? 'text.primary'
              : 'text.secondary',
          fontWeight: hightlightIndex === 0 ? 'bold' : 'normal',
        }}>
        หน้าหลัก
      </Link>
      {userName && (
        <Link
          href={`/chef/${props.userID}/recipe/all`}
          sx={{
            color:
              hightlightIndex === 1
                ? 'text.primary'
                : 'text.secondary',
            fontWeight: hightlightIndex === 1 ? 'bold' : 'normal',
          }}>
          {`เชฟ ${userName}`}
        </Link>
      )}
      {recipeName && (
        <Link
          href={`/chef/${props.userID}/recipe/${props.recipeID}`}
          sx={{
            color:
              hightlightIndex === 2
                ? 'text.primary'
                : 'text.secondary',
            fontWeight: hightlightIndex === 2 ? 'bold' : 'normal',
          }}>
          {`สูตร ${recipeName}`}
        </Link>
      )}
    </Breadcrumbs>
  )
}
