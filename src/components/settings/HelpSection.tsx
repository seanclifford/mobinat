import { Anchor, Image, List, Stack, Text, Title } from "@mantine/core";

export default function HelpSection() {
	return (
		<>
			<Title order={3}>Welcome to the MobiNat Annotator!</Title>
			<Text>
				This site was created to allow fast annotating of observations on{" "}
				<Anchor href="https://www.inaturalist.org">iNaturalist</Anchor> through
				a mobile device. <br />
				Before you can start annotating, you need to
			</Text>
			<List type="ordered">
				<List.Item>
					Set a filter on the <b>Filters</b> tab
				</List.Item>
				<List.Item>
					Login via your iNaturalist account on the <b>Account</b> tab, and
					choose to trust MobiNat.
				</List.Item>
			</List>
			<br />
			<Title order={4}>Filtering</Title>
			<Text>
				For speed, the recommended way to setup your filters is to set a
				particlar taxon of your choice using the <b>Taxon</b> filter and choose
				a annotation from the <b>Without Annotation</b> filter. This is so the
				available annotations stay consistent, and you have something to do on
				each observation.
				<br />
				You can set filters how you choose however, including adding any custom
				filters that are{" "}
				<Anchor
					href="https://forum.inaturalist.org/t/how-to-use-inaturalists-search-urls-wiki-part-1-of-2"
					target="_blank"
				>
					supported by iNaturalist
				</Anchor>
				.
			</Text>
			<br />
			<Title order={4}>
				Login: Trusting MobiNat with your iNaturalist account
			</Title>
			<Text>
				If you want to use MobiNat to make any changes on iNaturalist, you'll
				need to trust MobiNat to connect to your account with iNaturalist when
				you Login. If you're unsure about this, here's some things that might
				make you more comfortable:
			</Text>
			<List type="ordered">
				<List.Item>
					Your data is only sent to iNaturalist. During login, some information
					is send via our server, but only as a proxy in order to keep your
					account details secure on your device.{" "}
					<Anchor
						href="https://github.com/seanclifford/mobinat/blob/master/netlify/functions/authFlow.md"
						target="_blank"
					>
						Technical details of how this works can be found here.
					</Anchor>
				</List.Item>
				<List.Item>
					MobiNat doesn't store any server side data on your account, and does
					not identify or track your usage.
				</List.Item>
				<List.Item>
					When you <b>Login</b> on MobiNat, your iNaturalist account details are
					only stored locally on your device. You can clear this local login
					data at any time by choosing <b>Logout</b> from the Account tab.
				</List.Item>
				<List.Item>
					The code for MobiNat is all open source - so it is readable and
					auditable by anyone with the technical knowledge to do so. See the
					About tab for a link to the source code.
				</List.Item>
			</List>
			<br />
			<Title order={4}>Choosing an annotation</Title>
			<Text>
				Annotations have specific meanings. If you're unsure of which annotation
				values are appropriate for each situation, please refer to{" "}
				<Anchor
					href="https://help.inaturalist.org/en/support/solutions/articles/151000191830-what-are-the-definitions-of-inaturalist-annotations-"
					target="_blank"
				>
					this iNaturalist help article
				</Anchor>
				.
			</Text>
			<br />
			<Title order={4}>Annotating on a laptop or desktop computer</Title>
			<Text>
				MobiNat has been made for mobile and tablets in mind. While it will work
				on laptops and desktop computers, you may find using the Identify page
				to be a better experience. Read{" "}
				<Anchor
					href="https://www.inaturalist.org/pages/annotations"
					target="_blank"
				>
					this iNaturalist page on annotations
				</Anchor>{" "}
				if you're new to annotating using the Identify page.
			</Text>
			<Stack visibleFrom="md">
				<Text>Scan here to open MobiNat on a mobile device:</Text>
				<Image src="/qr-code.gif" w={220}></Image>
			</Stack>
		</>
	);
}
