import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import Web3Status from 'components/Web3Status'
import { chainIdToBackendName } from 'graphql/data/util'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { Box } from 'nft/components/Box'
import { Row } from 'nft/components/Flex'
import { useProfilePageState } from 'nft/hooks'
import { ProfilePageStateType } from 'nft/types'
import { ReactNode } from 'react'
import { NavLink, NavLinkProps, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'

import soloDarkLogo from '../../assets/solo/solo-dark-logo.png'
import { Bag } from './Bag'
import { ChainSelector } from './ChainSelector'
import * as styles from './style.css'

const Logo = styled.img`
  width: 48px;
  height: 48px;
`

const Nav = styled.nav`
  padding: 20px 12px;
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: 2;
`

const VerticalDivider = styled.div`
  margin: 0px;
  width: 1px;
  background-color: ${({ theme }) => theme.accentAction};
  @media screen and (min-width: ${({ theme }) => theme.breakpoint.md}px) {
    height: 25px;
  }
`

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
  dataTestId?: string
}

const MenuItem = ({ href, dataTestId, id, isActive, children }: MenuItemProps) => {
  return (
    <NavLink
      to={href}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: 'none' }}
      data-testid={dataTestId}
    >
      {children}
    </NavLink>
  )
}

export const PageTabs = () => {
  const { pathname } = useLocation()
  const { chainId: connectedChainId } = useWeb3React()
  const chainName = chainIdToBackendName(connectedChainId)

  const isPoolActive =
    pathname.startsWith('/deposit') || pathname.startsWith('/remove') || pathname.startsWith('/increase')

  const isNftPage = useIsNftPage()

  return (
    <>
      <MenuItem href="/swap" isActive={pathname.startsWith('/swap')}>
        <Trans>SWAP</Trans>
      </MenuItem>
      {/* <MenuItem href={`/tokens/${chainName.toLowerCase()}`} isActive={pathname.startsWith('/tokens')}>
        <Trans>Tokens</Trans>
      </MenuItem> */}
      {/* <MenuItem dataTestId="nft-nav" href="/nfts" isActive={isNftPage}>
        <Trans>NFTs</Trans>
      </MenuItem> */}
      <VerticalDivider />
      <MenuItem href="/earn" id="earn-nav-link" isActive={pathname.startsWith('/earn') || pathname.startsWith('/add')}>
        <Trans>EARN</Trans>
      </MenuItem>
      <VerticalDivider />
      <MenuItem href="/deposit" id="pool-nav-link" isActive={isPoolActive}>
        <Trans>POSITIONS</Trans>
      </MenuItem>
    </>
  )
}

const Navbar = () => {
  const isNftPage = useIsNftPage()
  const sellPageState = useProfilePageState((state) => state.state)
  const navigate = useNavigate()

  return (
    <>
      <Nav>
        <Box display="flex" height="full" flexWrap="nowrap">
          <Box className={styles.leftSideContainer}>
            <Box className={styles.logoContainer}>
              <Logo
                src={soloDarkLogo}
                className={styles.logo}
                onClick={() => {
                  navigate({
                    pathname: '/',
                    search: '?intro=true',
                  })
                }}
              />
            </Box>
            {!isNftPage && (
              <Box display={{ sm: 'flex', lg: 'none' }}>
                <ChainSelector leftAlign={true} />
              </Box>
            )}
          </Box>

          <Box className={styles.searchContainer}>
            <Row gap={{ xl: '0', xxl: '8' }} display={{ sm: 'none', lg: 'flex' }}>
              <PageTabs />
            </Row>
          </Box>
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              <Box position="relative" display={{ sm: 'flex', xl: 'none' }}>
                {/* <SearchBar /> */}
              </Box>
              <Box display={{ sm: 'none', lg: 'flex' }}>{/* <MenuDropdown /> */}</Box>
              {isNftPage && sellPageState !== ProfilePageStateType.LISTING && <Bag />}
              {!isNftPage && (
                <Box display={{ sm: 'none', lg: 'flex' }}>
                  <ChainSelector />
                </Box>
              )}

              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  )
}

export default Navbar
